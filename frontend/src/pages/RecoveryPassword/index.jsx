import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  SectionFormWrapper,
  FormWrapper,
  FormFooter,
  ActionFooter,
  LogoContainer,
  InputFlexWrapper,
} from "../../components/Forms/FormWrappers/styles";

import { RecoveryEmailSendContainer } from "./style";

import { Input } from "../../components/Forms/Input";
import { SubmitButton } from "../../components/Forms/SubmitButton";

import { SendFill } from "react-bootstrap-icons";
import logo from "../../assets/images/logo.svg";

export const RecoveryPassword = () => {
  return (
    <SectionFormWrapper>
      <LogoContainer>
        <img src={logo} alt="Logo Sistema Rótus" />
        <h1>Rótus</h1>
      </LogoContainer>

      <FormWrapper onSubmit={() => {}}>
        <h1>Recuperar senha</h1>
        <InputFlexWrapper>
          <RecoveryEmailSendContainer>
            <Input
              label="E-mail"
              type="email"
              value={""} // A definir no gerenciamento de estados do Login
              placeholder="Digite seu e-mail..."
              onChange={() => {}}
            />
            <SubmitButton title={<SendFill />} />
          </RecoveryEmailSendContainer>

          <Input
            label="Código"
            type="text"
            value={""} // A definir no gerenciamento de estados do Login
            placeholder="Digite sua senha..."
            onChange={() => {}}
          />
        </InputFlexWrapper>

        <SubmitButton title="Continuar" onClick={() => {}} />
      </FormWrapper>
      <FormFooter>
        <ActionFooter>
          <p>
            Lembrou a senha? <a href="/login">Entre</a>
          </p>
        </ActionFooter>
      </FormFooter>
    </SectionFormWrapper>
  );
};
