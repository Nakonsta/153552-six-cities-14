import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { store } from '../../store';
import { AppRoute } from '../../const';
import { loginAction } from '../../store/api-actions';
import { getAuthorizationStatus } from '../../store/autorization-status-data/selectors';
import { AuthStatus } from '../../const';

function LoginPage(): JSX.Element {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  const navigate = useNavigate();

  const authorizationStatus = useSelector(getAuthorizationStatus);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (loginRef.current !== null && passwordRef.current !== null && passwordRef.current.value.trim()) {
      store.dispatch(loginAction({
        login: loginRef.current.value,
        password: passwordRef.current.value
      }));
    }
  };

  const checkIsValid = () => {
    const login = loginRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    if(!password || !login) {
      setIsValid(false);
      return;
    }

    const re = /[0-9]/;
    const re1 = /[a-z]/i;
    const re2 = /[а-я]/i;

    const isValidForm = re.test(password) && (re1.test(password) || re2.test(password));
    setIsValid(isValidForm);
  };

  useEffect(() => {
    if (authorizationStatus === AuthStatus.Auth) {
      navigate(AppRoute.Main);
    }
  }, [authorizationStatus]);

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>Проект 6 городов - логин</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link to={AppRoute.Main} className="header__logo-link">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={(evt) => handleSubmit(evt)}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={loginRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onInput={checkIsValid}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password" name="password"
                  placeholder="Password"
                  required
                  onInput={checkIsValid}
                />
              </div>
              <button className="login__submit form__submit button" type="submit" disabled={!isValid}>Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
