import React from 'react';
import { useMe } from '../../hooks/useMe';
import { Button } from '../../components/button';
import { useForm } from 'react-hook-form';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { editProfile, editProfileVariables } from '../../gql/editProfileMutation';
import { Helmet } from 'react-helmet-async';

const EDIT_PROFILE_MUTATION = gql`
  mutation editprofile($input: EditProfileInput!){
    editProfile(input:$input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email: string;
  password: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient(); //apollo hook
  const onCompleted = (data: editProfile) => {
    const { ok } = data;
    if (ok && userData) {
      //refetch useMe is slower, which get all data from backend. this way is faster
      const { me : { email: prevEmail, id } } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        //update the cache
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: true,
          }
       });
      }
    }
  };
  const [ editProfile, {loading}] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
      password: ""
    }
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }) //condition password setting
        }
      }
    })
  };
  return (
    <div className='mt-52 flex flex-col justify-center items-center'>
      <Helmet>
        <title>Edit Profile | Here You Go</title>
      </Helmet>
      <h4 className='font-semibold text-2xl mb-3'>Edit profile</h4>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className='grid max-w-screen-sm grid-gap mt-5 w-full mb-5'
      >
        <input 
          {...register('email', {
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          })} 
          name='email' 
          className='input' 
          type='email' 
          placeholder='Email' 
          required 
        />
        <input 
          {...register('password')} 
          name='password' 
          className='input' 
          type='password' 
          placeholder='Password' 
        />
        <Button 
          loading={false} 
          canClick={isValid} 
          actionText="Save Profile" 
        />
      </form>
    </div>

  );
};

