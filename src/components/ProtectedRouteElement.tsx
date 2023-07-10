import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../services/store';
import { IUser } from '../utils/interfaces';
import Loader from './Loader/Loader';

interface ProtectedProps {
  onlyUnAuth?: boolean;
  component: JSX.Element;
}

const ProtectedRoute = ({ onlyUnAuth = false, component }: ProtectedProps) => {
  // isAuthChecked это флаг, показывающий что проверка токена произведена
  // при этом результат этой проверки не имеет значения, важно только,
  // что сам факт проверки имел место.
  const isAuthChecked = useAppSelector<boolean>((store) => store.user.isAuthChecked);
  const user = useAppSelector<IUser | null>((store) => store.user.user);
  const location = useLocation();

  if (!isAuthChecked) {
    // Запрос еще выполняется
    // Выводим прелоадер в ПР
    // Здесь возвращается просто null для экономии времени
    return <Loader />;
  }

  if (onlyUnAuth && user) {
    // Пользователь авторизован, но роут предназначен для неавторизованного пользователя
    // Делаем редирект на главную страницу или на тот адрес, что записан в location.state.from
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // !onlyUnAuth && user Пользователь авторизован и роут для авторизованного пользователя

  return component;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({ component }: ProtectedProps) => (
  <ProtectedRoute onlyUnAuth={true} component={component} />
);
