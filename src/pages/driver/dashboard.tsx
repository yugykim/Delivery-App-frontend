/** @format */

import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { coockedOrders } from '../../gql/cookedOrder';
import { useNavigate } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../gql/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
	subscription cookedOrders {
		cookedOrders {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
	mutation takeOrder($input: TakeOrderInput!) {
		takeOrder(input: $input) {
			ok
			error
		}
	}
`;

interface ICoords {
	lat: number;
	lng: number;
}

interface IDriverProps {
	lat: number;
	lng: number;
	$hover: any;
}

const Driver: React.FC<IDriverProps> = () => <div className='text-lg'>🚖</div>;
export const Dashboard = () => {
	const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
	const [map, setMap] = useState<google.maps.Map>();
	const [maps, setMaps] = useState<any>();
	const navigate = useNavigate();
	// @ts-ignore
	const onSucces = ({ coords: { latitude, longitude } }: Position) => {
		setDriverCoords({ lat: latitude, lng: longitude });
	};
	// @ts-ignore
	const onError = (error: PositionError) => {
		console.log(error);
	};
	useEffect(() => {
		navigator.geolocation.watchPosition(onSucces, onError, {
			enableHighAccuracy: true,
		});
	}, []);
	useEffect(() => {
		if (map && maps) {
			map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
			/* 			const geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{
					location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
				},
				(result, status) => {
					console.log(status, result);
				}
			); */
		}
	}, [driverCoords.lat, driverCoords.lng]);
	const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
		setMap(map);
		setMaps(maps);
		map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
	};
	const makeRoute = () => {
		if (map) {
			const directionsService = new google.maps.DirectionsService();
			const directionRenderer = new google.maps.DirectionsRenderer();
			directionRenderer.setMap(map);
			directionsService.route(
				{
					origin: {
						location: new google.maps.LatLng(
							driverCoords.lat,
							driverCoords.lng
						),
					},
					destination: {
						location: new google.maps.LatLng(
							driverCoords.lat + 0.05,
							driverCoords.lng + 0.05
						),
					},
					travelMode: google.maps.TravelMode.DRIVING,
				},
				(result) => {
					directionRenderer.setDirections(result);
				}
			);
		}
	};
	const { data: cookedOrdersData } = useSubscription<coockedOrders>(
		COOKED_ORDERS_SUBSCRIPTION
	);
	useEffect(() => {
		if (cookedOrdersData?.cookedOrders) {
			//show the preview of the path of the driver
			makeRoute();
		}
	}, [cookedOrdersData]);
	const onCompleted = (data: takeOrder) => {
		if (data.takeOrder.ok) {
			navigate(`/orders/${cookedOrdersData?.cookedOrders.id}`);
		}
	};
	const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
		TAKE_ORDER_MUTATION,
		{
			onCompleted,
		}
	);
	const triggerMutation = (orderId: number) => {
		takeOrderMutation({
			variables: {
				input: {
					id: orderId,
				},
			},
		});
	};
	return (
		<div>
			<div
				className='overflow-hidden'
				style={{ width: window.innerWidth, height: '50vh' }}>
				<GoogleMapReact
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={onApiLoaded}
					bootstrapURLKeys={{ key: 'AIzaSyAALxRfLcD9g1esBRgEZ3461fU5HCl-zAg' }}
					defaultCenter={{
						lat: 51.05258350166104,
						lng: -114.04133372952464,
					}}
					defaultZoom={18}
					draggable={true}>
					<Driver
						lat={driverCoords.lat}
						lng={driverCoords.lng}
						$hover={true}
					/>
				</GoogleMapReact>
			</div>
			<div className=' max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5'>
				{cookedOrdersData?.cookedOrders.restaurant ? (
					<>
						<h1 className='text-center  text-3xl font-medium'>
							New Coocked Order
						</h1>
						<h1 className='text-center my-3 text-2xl font-medium'>
							Pick it up soon @{' '}
							{cookedOrdersData?.cookedOrders.restaurant?.name}
						</h1>
						<button
							onClick={() => triggerMutation(cookedOrdersData?.cookedOrders.id)}
							className='btn w-full  block  text-center mt-5'>
							Accept Challenge &rarr;
						</button>
					</>
				) : (
					<h1 className='text-center  text-3xl font-medium'>
						No orders yet...
					</h1>
				)}
			</div>
		</div>
	);
};
