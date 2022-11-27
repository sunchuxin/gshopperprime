import { useState } from 'react';
import { useNavigate, Link } from '@shopify/hydrogen/client';

import { emailValidation, passwordValidation } from '~/lib/utils';

import { callLoginApi } from './AccountLoginForm.client';
import { getInputStyleClasses } from '../../lib/styleUtils';


export function AccountCreateForm() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState(null);

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(null);

  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    setFirstNameError(null)
    setLastNameError(null)
    setEmailError(null);
    setPasswordError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.currentTarget.email);
    if (newEmailError) {
      setEmailError(newEmailError);
    }

    const newPasswordError = passwordValidation(event.currentTarget.password);
    if (newPasswordError) {
      setPasswordError(newPasswordError);
    }

    if (newEmailError || newPasswordError) {
      return;
    }

    const accountCreateResponse = await callAccountCreateApi({
      email,
      password,
    });

    if (accountCreateResponse.error) {
      setSubmitError(accountCreateResponse.error);
      return;
    }

    // this can be avoided if customerCreate mutation returns customerAccessToken
    await callLoginApi({
      email,
      password,
    });

    navigate('/account');
  }

  return (
    <div className="flex justify-center px-4 my-12">
      <div className="max-w-md w-full">
        <h1 className="text-4xl text-center">Register</h1>
        <form noValidate className="pt-6 pb-8 mt-4 mb-4" onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-contrast">{submitError}</p>
            </div>
          )}
          <div className="mb-3">
            <input
              className={`mb-1 ${getInputStyleClasses(firstNameError)}`}
              id="firstName"
              name="firstName"
              type="firstName"
              autoComplete="firstName"
              required
              autoFocus
              placeholder="First name"
              aria-label="First name"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
            {!firstNameError ? (
              ''
            ) : (
              <p className={`text-red-500 text-xs`}>{firstNameError} &nbsp;</p>
            )}
          </div>
          <div className="mb-3">
            <input
              className={`mb-1 ${getInputStyleClasses(lastNameError)}`}
              id="lastName"
              name="lastName"
              type="lastName"
              autoComplete="lastName"
              required
              placeholder="Last name"
              aria-label="Last name"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
            {!lastNameError ? (
              ''
            ) : (
              <p className={`text-red-500 text-xs`}>{lastNameError} &nbsp;</p>
            )}
          </div>
          <div className="mb-3">
            <input
              className={`mb-1 ${getInputStyleClasses(emailError)}`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              aria-label="Email"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            {!emailError ? (
              ''
            ) : (
              <p className={`text-red-500 text-xs`}>{emailError} &nbsp;</p>
            )}
          </div>
          <div className="mb-3">
            <input
              className={`mb-1 ${getInputStyleClasses(passwordError)}`}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              minLength={8}
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            {!passwordError ? (
              ''
            ) : (
              <p className={`text-red-500 text-xs`}>{passwordError} &nbsp;</p>
            )}
          </div>
          <div className="flex items-center flex-start my-4">
            <input
              type="checkbox"
              value=""
              name="defaultAddress"
              id="defaultAddress"
              checked={isDefaultAddress}
              className="border-gray-500 rounded-sm cursor-pointer border-1"
              onChange={() => setIsDefaultAddress(!isDefaultAddress)}
            />
            <label className="inline-block ml-2 text-xs cursor-pointer" htmlFor="defaultAddress">
              I agree with GshopperPrime's Terms & Conditions and Privacy Policy
            </label>
          </div>
          <div className="flex items-center flex-start my-4">
            <input
              type="checkbox"
              value=""
              name="defaultAddress"
              id="defaultAddress"
              checked={isDefaultAddress}
              className="border-gray-500 rounded-sm cursor-pointer border-1"
              onChange={() => setIsDefaultAddress(!isDefaultAddress)}
            />
            <label className="inline-block ml-2 text-xs cursor-pointer" htmlFor="defaultAddress">
              I would like to receive exclusive deals deals & latest news on hot picks!
            </label>
          </div>
          <div className="flex items-center flex-start">
            <button className="bg-btn-primary-color text-contrast rounded py-2 px-4 focus:shadow-outline w-full" type="submit">
              Sign Up
            </button>
          </div>
          <div className="flex items-center mt-4">
            <p className="align-baseline text-sm">
              Already have an account? &nbsp;
              <Link className="inline underline" to="/account">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function callAccountCreateApi({
  email,
  password,
  firstName,
  lastName,
}) {
  try {
    const res = await fetch(`/account/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (res.status === 200) {
      return {};
    } else {
      return res.json();
    }
  } catch (error) {
    return {
      error: error.toString(),
    };
  }
}
