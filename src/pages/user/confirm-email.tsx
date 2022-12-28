import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { verifyEmail, verifyEmailVariables } from '../../gql/verifyEmailMutation';
import { useMe } from '../../hooks/useMe';
import { useNavigate } from 'react-router-dom';


const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInputput!){
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;


export const ConfirmEmail = () => {
  const { data: userData, refetch } = useMe();
  const client = useApolloClient(); //apollo hook
  const navigate = useNavigate();
  const onCompleted = async (data: verifyEmail) => {
    const { ok } = data;
    if ( ok && userData?.me.id ) {
      await refetch();
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
  }, []);

  return (
    <div className=' mt-52 flex flex-col items-center justify-center'>
      <h2 className=' text-lg mb-2 font-medium'>Confirming email...</h2>
      <h4 className=' text-gray-700 text-sm'>Please wait, don't close this page</h4>
    </div>
  );
};