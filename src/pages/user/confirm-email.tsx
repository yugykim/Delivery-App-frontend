import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { verifyEmail, verifyEmailVariables } from '../../gql/verifyEmailMutation';
import { useMe } from '../../hooks/useMe';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInputput!){
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;


export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient(); //apollo hook
  const navigate = useNavigate();
  const onCompleted = async (data: verifyEmail) => {
    const { ok } = data;
    if ( ok && userData?.me.id ) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      navigate(-1);
    };
  };
  //fragment  we want to modify the cache
  //fragment is part of type, the part of the whole model. 
  const [ verifiyEmail ] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY_EMAIL_MUTATION, {
    onCompleted
  });
  useEffect(() => {
    const [_, code] = window.location.href.split("code="); //_ => nothing
    verifiyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
  }, [verifiyEmail]);

  return (
    <div className=' mt-52 flex flex-col items-center justify-center'>
      <Helmet>
        <title>Verify Email| Nuber Eats</title>
      </Helmet>
      <h2 className=' text-lg mb-2 font-medium'>Confirming email...</h2>
      <h4 className=' text-gray-700 text-sm'>Please wait, don't close this page</h4>
    </div>
  );
};