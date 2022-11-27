import { SetStateAction, useState } from 'react';
import { useNavigate, Link, useRouteParams } from '@shopify/hydrogen/client';
import { getInputStyleClasses } from '../../lib/styleUtils';
import { useWindowSize } from 'react-use';

export function AccountLoginForm({ shopName }) {
  const navigate = useNavigate();
  const { width = 0, height = 0 } = useWindowSize();

  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [showEmailField, setShowEmailField] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userEmailError, setUserEmailError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const [loginType, setLoginType] = useState(1);
  const [countryId, setCountryId] = useState(1);
  const [isPassLogin, setIsPassLogin] = useState(true);
  const [loginRegionCode, setLoginRegionCode] = useState([]);
  const [isRemember, setIsRemember] = useState([])



  let cacheCountryData = '';
  let loginSelectCountry = '';
  let registSelectCountry = '';
  let diosgla = false;
  let regitsCountryName = '';
  let loginCountryName = '';
  let pageCode = 'page';
  let tagCode = 'tag';
  let loginForm = {
    userEmail: '',
    password: '',
    phone: '',
    smsCode: '',
  };
  let loginRules = {};
  let dialogRegistVisible = false;
  let isAgree = false;
  let registForm = {
    userEmail: '',
    password: '',
    checkPass: '',
    isAgreeEmail: false,
    phone: '',
    verifyCode: '',
    imgCode: ''
  };
  let registRules = {};
  let fullscreenLoading = false;
  let errorMessage = {
    account: '',
    pass: '',
    checkPass: '',
  };
  let articleList = [];
  let privacy = {};
  let terms = {};
  let registType = 1;
  let selectRegionIcon = '';
  let loginRegionIcon = '';
  let codeText = '';
  let sendBtnDisabled = false;
  let imgCodeUrl = '';
  let imgCodeDate = '';
  let registRegionCode = '';
  let emailDialogVisible = false;
  let sendEmailBtnDisabled = false;
  let emailCodeText = '';
  let emailVerifyCode = '';
  let emailRegistForm = {};
  let emailRegistLoading = false;
  let registTimer = null;
  let firstLogin = false;
  let googleParams = {
    client_id: "750761285953-favf5091s5t1tcf0jsitpb35eeg51kki.apps.googleusercontent.com"
  };
  let loginCodeTimer = null; //  登录验证码定时器
  let loginCodeText = '';  // 倒计时文案
  let loginCodeBtnDisabled = false;  // 发送验证码按钮禁用状态



  function onSubmit(event) {
    event.preventDefault();

    setUserEmailError(null);
    setHasSubmitError(false);
    setPasswordError(null);

    if (showEmailField) {
      checkEmail(event);
    } else {
      checkPassword(event);
    }
  }

  function checkEmail(event) {
    if (event.currentTarget.email.validity.valid) {
      setShowEmailField(false);
    } else {
      setUserEmailError('Please enter a valid email');
    }
  }

  async function checkPassword(event) {
    const validity = event.currentTarget.password.validity;
    if (validity.valid) {
      const response = await callLoginApi({
        userEmail,
        password,
      });

      if (response.error) {
        setHasSubmitError(true);
        resetForm();
      } else {
        navigate('/account');
      }
    } else {
      setPasswordError(
        validity.valueMissing
          ? 'Please enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }
  }

  function resetForm() {
    setShowEmailField(true);
    setUserEmail('');
    setUserEmailError(null);
    setPassword('');
    setPasswordError(null);
  }
  function onClickSelectLoginType(v) {
    return () => {
      setLoginType(v)
    }
  }
  function togglePhoneLoginType() {
    return () => {
      setIsPassLogin(!isPassLogin)
      if (isPassLogin) {
        getPhoneValidRules();
      } else {
        getPhoneCodeValidRules();
      }
      /* this.$nextTick(() => {
        this.$refs["loginForm"].clearValidate();
      }); */
    }
  }
  // 获取手机号密码登录表单验证
  function getPhoneValidRules() {
    this.loginRules.phone = [{
      required: true,
      message: this.$lang.enterYourMobilephone,
      trigger: 'blur',
    }];
    this.loginRules.password = [{
      validator: this.validPassword,
      trigger: 'blur',
    }];
    this.loginRules.smsCode = [{
      value: ''
    }];
    this.loginRules.userEmail = [{
      value: ''
    }];
  }
  // 获取手机号验证码登录表单验证
  function getPhoneCodeValidRules() {
    this.loginRules.phone = [{
      required: true,
      message: this.$lang.enterYourMobilephone,
      trigger: 'blur',
    }];
    this.loginRules.smsCode = [{
      required: true,
      message: this.$lang.checkMessage.codeRequire,
      trigger: 'blur',
    }];
    this.loginRules.password = [{
      value: ''
    }];
    this.loginRules.userEmail = [{
      value: ''
    }];
  }

  function loginSelectRegion(val, type) {
    console.log('国家数据', this.countryData);
    for (const item of this.countryData) {
      if (val == item.countryId) {
        if (type === 'login') {
          this.loginRegionIcon = item.index;
          this.loginCountryName = item.countryName;
          this.loginForm.regionCode = item.regionNumber;
        } else {
          this.selectRegionIcon = item.index;
          this.registForm.regionCode = item.regionNumber;
        }
        break;
      }
    }
    this.cacheCountryData = this.countryData
  }
  /**
   * @Description: 切换密码展示
   * @date 2019/7/17
  */
  function togglePass($event) {
    debugger
    const ele = $event.target;
    const classList = Array.from(ele.classList);
    if (classList.indexOf('active') >= 0) {
      ele.classList.remove('active');
      ele.parentNode.querySelector('input').type = 'password';
    } else {
      ele.classList.add('active');
      ele.parentNode.querySelector('input').type = 'text';
    }
  }
  // 发送手机验证码
  function getPhoneCode() {
    if (this.loginCodeTimer) return;
    if (this.loginCodeBtnDisabled) return;
    this.loginCodeBtnDisabled = true;
    this.$refs["loginForm"].validateField("phone", (valid) => {
      if (valid) return;
      const data = Object.assign({}, this.loginForm);
      this.$http.post("/api/message/validCode/sms/loginByPhone", {
        mobile: data.phone,
        region: data.regionCode,
        clientType: this.deviceType ? "N002430300" : "N002430200",
        smsClass: 3,
      }).then(() => {
        let count = 60;
        this.loginCodeTimer = setInterval(() => {
          if (count > 0) {
            this.loginCodeText = count + "s";
            count--;
          } else {
            count = 60;
            this.loginCodeText = this.$lang.login_get_code_again;
            clearTimeout(this.loginCodeTimer);
            this.loginCodeTimer = null;
          }
        }, 1000);
      }).finally(() => {
        this.loginCodeBtnDisabled = false;
      });
    });
  }
  function toSignUp(v) {
    console.log(v);

  }
  function toForgot() {
    window.location.href = `/${this.$root.COOKIE_COUNTRY}/forget`;
  }
  const style_1 = `${width > 640 ? 'mx-4 my-12 ' : ''} flex justify-center`
  const style_2 = `${width > 640 ? 'pb-16 ' : ''}`
  const style_3 = `${width > 640 ? '' : 'hidden '} bg-login-size bg-login-image h-login-height w-login-width bg-no-repeat bg-login-position`
  const style_4 = `${width > 640 ? 'pt-4 ' : ''} flex items-center flex-start`

  return (
    <div className={style_1}>
      <div className='w-full'>
        <div className={style_2}>
          <div className="flex justify-evenly max-w-screen-xl mx-auto">
            <div className={style_3}></div>
            <section className="bg-white py-6 px-8 w-login-form box-border box-login-form relative">
              <div className="text-center mb-7">
                <span className='text-3xl font-medium font-login-title text-login-title'>Sign In</span>
              </div>
              <form noValidate className="pt-6 pb-8 mt-4 mb-4" onSubmit={onSubmit}>
                <div className="mb-3">
                  <input
                    className={`mb-1 outline-none ${getInputStyleClasses(userEmailError)}`}
                    id="userEmail"
                    name="userEmail"
                    type="userEmail"
                    autoComplete="userEmail"
                    required
                    placeholder="user Email"
                    aria-label="user Email"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    value={userEmail}
                    onChange={(event) => {
                      setUserEmail(event.target.value);
                    }}
                  />
                  {!userEmailError ? (
                    ''
                  ) : (
                    <p className={`text-red-500 text-xs`}>{userEmailError} &nbsp;</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    className={`mb-1 outline-none ${getInputStyleClasses(passwordError)}`}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    placeholder="Password"
                    aria-label="Password"
                    autoFocus
                    value={password}
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
                <div className="mb-3">
                  <div className="flex justify-between items-center w-full">
                    {/* <checkbox  checkedColor='#FF5224' shape='square' iconSize='14px' checked={isRemember} onChange={setIsRemember}>Remember Me</checkbox> */}
                    <div className='flex items-center'>
                      <input className='w-4 h-4 border-grey9 rounded-sm' type='checkbox' value={isRemember} />
                      <span className='text-grey6 text-base'>Remember Me</span>
                    </div>
                    <div className={`text-grey6 text-base hover:text-plain cursor-pointer`}>
                      <Link to="/account/recover">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={style_4}>
                  <button className="bg-btn-primary-color text-contrast rounded py-2 px-4 focus:shadow-outline w-full" type="submit">
                    SIGN IN
                  </button>
                </div>
                <div className="flex items-center flex-start mt-16">
                  <div className="w-full text-center text-login-account">
                    <p className="mb-4 text-bese text-center text-grey3 text-medium">Haven't got an accout</p>
                    <Link to="/account/register">
                      <button className="text-plain bg-btn-plain-color border-plain border border-solid rounded py-2 px-4 focus:shadow-outline w-full">
                        Register
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </section>
          </div >
        </div >
      </div >
    </div>
  );
}

export async function callLoginApi({ userEmail, password }) {
  try {
    const res = await fetch(`http://capi.stage-gp.com/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: "15701549533",
        clientType: "N002430200",
        password: "sunrun321",
        region: 86
      }),
    });
    console.log(res);

    if (res.ok) {
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

function EmailField({ email, setEmail, emailError, shopName }) {
  return (
    <>
      <div className="mb-3">
        <input
          className={`mb-1 ${getInputStyleClasses(emailError)}`}
          id="email"
          name="eaaaaaaaaaaaaaamail"
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
          className="bg-primary rounded text-contrast py-2 px-4 focus:shadow-outline block w-full"
          type="submit"
        >
          Next
        </button>
      </div>
      <div className="flex items-center mt-8 border-t  border-gray-300">
        <p className="align-baseline text-sm mt-6">
          New to {shopName}? &nbsp;
          <Link className="inline underline" to="/account/register">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}

function ValidEmail({ email, resetForm }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p>{email}</p>
        <input
          className="hidden"
          type="text"
          autoComplete="username"
          value={email}
          readOnly
        ></input>
      </div>
      <div>
        <button
          className="inline-block align-baseline text-sm underline"
          type="button"
          onClick={resetForm}
        >
          Change email
        </button>
      </div>
    </div>
  );
}

function PasswordField({ password, setPassword, passwordError }) {
  return (
    <>
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        {!passwordError ? (
          ''
        ) : (
          <p className={`text-red-500 text-xs`}> {passwordError} &nbsp;</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-primary text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
          type="submit"
        >
          Sign in
        </button>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1"></div>
        <Link
          className="inline-block align-baseline text-sm text-primary/50"
          to="/account/recover"
        >
          Forgot password
        </Link>
      </div>
    </>
  );
}
