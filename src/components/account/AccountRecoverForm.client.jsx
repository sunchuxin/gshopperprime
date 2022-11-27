import { useState } from 'react';

import { Link } from '@shopify/hydrogen/client';
import { emailValidation } from '~/lib/utils';
import { getInputStyleClasses } from '../../lib/styleUtils';

export function AccountRecoverForm({ id, resetToken }) {
  // 邮箱
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [emailSubmitSuccess, setEmailSubmitSuccess] = useState(false);
  const [emailSubmitError, setEmailSubmitError] = useState(null);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);

  const [passwordSubmitSuccess, setPasswordSubmitSuccess] = useState(false);
  const [passwordSubmitError, setPasswordSubmitError] = useState(null);


  function onSubmit(event) {
    event.preventDefault();
    if (emailSubmitSuccess) {
      // 修改密码
      passwordSubmit(event)
    } else {
      // 确认邮箱
      emailSubmit(event)
    }
  }

  async function emailSubmit(event) {

    setEmailError(null);
    setEmailSubmitError(null);

    const newEmailError = emailValidation(event.currentTarget.email);

    if (newEmailError) {
      setEmailError(newEmailError);
      return;
    }

    const res = await callAccountRecoverApi({
      email,
    });
    console.log(res);


    // setEmail('');
    setEmailSubmitSuccess(true);
  }

  function passwordValidation(form) {
    setPasswordError(null);
    setPasswordConfirmError(null);

    let hasError = false;

    if (!form.password.validity.valid) {
      hasError = true;
      setPasswordError(
        form.password.validity.valueMissing
          ? 'Please enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (!form.passwordConfirm.validity.valid) {
      hasError = true;
      setPasswordConfirmError(
        form.password.validity.valueMissing
          ? 'Please re-enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (password !== passwordConfirm) {
      hasError = true;
      setPasswordConfirmError('The two password entered did not match.');
    }

    return hasError;
  }

  async function passwordSubmit(event) {
    if (passwordValidation(event.currentTarget)) {
      return;
    }

    const response = await callPasswordResetApi({
      id,
      resetToken,
      password,
    });
    console.log(response);

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    navigate('/account');
  }

  return (
    <div className="flex justify-center my-24 px-4 py-24">
      <div className="max-w-md w-full">
        {emailSubmitSuccess ? (
          <>
            <h1 className="text-4xl">Set Password</h1>
            <p className="text-base mt-4 break-all">
              Enter a new password for {email}
            </p>
            <form noValidate className="pb-8 mt-4 mb-4" onSubmit={onSubmit}>
              {emailSubmitError && (
                <div className="flex items-center justify-center mb-6 bg-zinc-500">
                  <p className="m-4 text-s text-contrast">{emailSubmitError}</p>
                </div>
              )}
              <div className="mb-3">
                <input
                  className={`mb-1 ${getInputStyleClasses(passwordError)}`}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  aria-label="Password"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={password}
                  minLength={8}
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
                <p
                  className={`text-red-500 text-xs ${!passwordError ? 'invisible' : ''
                    }`}
                >
                  {passwordError} &nbsp;
                </p>
              </div>
              <div className="mb-3">
                <input
                  className={`mb-1 ${getInputStyleClasses(passwordConfirmError)}`}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Re-enter password"
                  aria-label="Re-enter password"
                  value={passwordConfirm}
                  required
                  minLength={8}
                  onChange={(event) => {
                    setPasswordConfirm(event.target.value);
                  }}
                />
                <p
                  className={`text-red-500 text-xs ${!passwordConfirmError ? 'invisible' : ''
                    }`}
                >
                  {passwordConfirmError} &nbsp;
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-btn-primary-color text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
                  type="submit"
                >
                  Submit
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
          </>
        ) : (
          <>
            <h1 className="text-4xl">Forgot Password</h1>
            <p className="text-base mt-4 break-all">
              We will send you an email to reset your password
            </p>
            <form noValidate className="pb-8 mt-4 mb-4" onSubmit={onSubmit}>
              {emailSubmitError && (
                <div className="flex items-center justify-center mb-6 bg-zinc-500">
                  <p className="m-4 text-s text-contrast">{emailSubmitError}</p>
                </div>
              )}
              {emailSubmitSuccess && (
                <div className="flex items-center justify-center mb-6 bg-zinc-500">
                  <p className="m-4 text-s text-contrast">{emailSubmitSuccess}</p>
                </div>
              )}
              <div className="mb-3">
                <input
                  className={`mb-1 ${getInputStyleClasses(emailError)}`}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
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

              <div className="flex items-center justify-between">
                <button
                  className="bg-btn-primary-color text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
                  type="submit"
                >
                  Submit
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
          </>
        )}
      </div>
    </div>
  );
}

export async function callAccountRecoverApi({
  email,
  password,
  firstName,
  lastName,
}) {
  try {
    const res = await fetch(`/account/recover`, {
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
      console.log(res);

      return res.json();
    }
  } catch (error) {
    return {
      error: error.toString(),
    };
  }
}
