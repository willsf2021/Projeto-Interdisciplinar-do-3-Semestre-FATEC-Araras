import {
  HeaderContainer,
  AvatarContainer,
  GreetingMessage,
  LogoutContainer,
  LogoutLink,
} from "./style";

import { PersonCircle, BoxArrowLeft } from "react-bootstrap-icons";

export const Header = ({ userName }) => {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(today);

  return (
    <HeaderContainer>
      <AvatarContainer>
        <PersonCircle />
      </AvatarContainer>

      <GreetingMessage>
        <p>
          Olá, <strong>{userName}</strong>, Seja bem-vinda!
        </p>
        <small>Hoje é {formattedDate}</small>
      </GreetingMessage>

      <LogoutContainer>
        <LogoutLink href="/login">
          <BoxArrowLeft />
        </LogoutLink>
      </LogoutContainer>
    </HeaderContainer>
  );
};
