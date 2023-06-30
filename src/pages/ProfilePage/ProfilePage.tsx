import React, { useEffect } from 'react';
import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { editUser, logoutUser } from '../../services/actions/actions';
import { isValidEmail, isValidName, isValidPassword } from '../../utils/utils';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((store) => store.user.user);

  const [nameValue, setNameValue] = React.useState(userData!.name);
  const [emailValue, setEmailValue] = React.useState(userData!.email);
  const [passValue, setPassValue] = React.useState('');
  const [btnVisible, setBtnVisible] = React.useState(false);

  useEffect(() => {
    if (nameValue !== userData?.name || emailValue !== userData?.email || passValue) {
      setBtnVisible(true);
    } else {
      setBtnVisible(false);
    }
  }, [nameValue, emailValue, passValue, userData?.name, userData?.email]);

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(logoutUser());
  };

  const handleSubmitForm = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail(emailValue)) {
      return alert('Неверный формат Email');
    } else if (!isValidName(nameValue)) {
      return alert('Имя должно быть от 3-х символов');
    } else if (!isValidPassword(passValue) && passValue) {
      return alert('Пароль должен быть от 6-ти символов');
    } else {
      dispatch(editUser({ name: nameValue, email: emailValue, password: passValue }));
    }
  };

  const handleSettingCancel = () => {
    setNameValue(userData!.name);
    setEmailValue(userData!.email);
    setPassValue('');
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sectionContainer}>
        <div className={styles.linkContainer}>
          <Link className={`${styles.link} ${styles.active}`} to="/profile">
            Профиль
          </Link>
          <Link className={styles.link} to="/profile/orders">
            История заказов
          </Link>
          <Link className={styles.link} to="/" onClick={handleLogout}>
            Выход
          </Link>
        </div>
        <p className={styles.textLinkContainer}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </div>
      <form className={styles.inputContainer} onSubmit={handleSubmitForm}>
        <Input
          type={'text'}
          placeholder={'Имя'}
          onChange={(e) => setNameValue(e.target.value)}
          value={nameValue}
          error={false}
          errorText={'Ошибка'}
        />
        <Input
          type="email"
          placeholder={'E-mail'}
          onChange={(e) => setEmailValue(e.target.value)}
          value={emailValue}
          name={'email'}
          error={false}
          errorText={'Ошибка'}
        />
        <Input
          type="password"
          placeholder={'Password'}
          onChange={(e) => setPassValue(e.target.value)}
          value={passValue}
          name={'password'}
          error={false}
          errorText={'Ошибка'}
        />
        {btnVisible ? (
          <div className={styles.buttons}>
            <Button htmlType="submit">Сохранить</Button>
            <Button onClick={handleSettingCancel} htmlType="button">
              Отмена
            </Button>
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
