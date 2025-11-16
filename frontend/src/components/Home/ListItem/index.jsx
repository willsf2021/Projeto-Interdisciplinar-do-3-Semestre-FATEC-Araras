// components/Home/ListItem/index.jsx
import React from "react";
import { 
  FileText, 
  Person, 
  Calendar,
  FileEarmarkText,
  Telephone,
  Envelope,
  Trash
} from "react-bootstrap-icons";
import { 
  ItemCard, 
  ItemIcon, 
  ItemContent, 
  ItemHeader,
  ItemTitle, 
  ItemDescription, 
  ItemMeta,
  ItemPhone,
  RemoveButton
} from "./styles";

export const ListItem = ({ type, item, onClick, onRemove }) => {
  const isDocument = type === 'documents';

  return (
    <ItemCard onClick={onClick} clickable={!!onClick}>
      <ItemHeader>
        <ItemIcon>
          {isDocument ? <FileEarmarkText /> : <Person />}
        </ItemIcon>
        
        <ItemContent>
          <ItemTitle>{item.nome_completo || 'Sem nome'}</ItemTitle>
          
          <ItemDescription>
            {isDocument ? (
              <>
                <FileText size={12} />
                {item.description || 'Documento sem descrição'}
              </>
            ) : (
              <>
                <Envelope size={12} />
                {item.email || 'Cliente sem email'}
              </>
            )}
          </ItemDescription>
          
          {/* Campo de Celular para Clientes */}
          {!isDocument && (
            <ItemPhone>
              <Telephone size={12} />
              <span>
                {item.celular || item.telefone || item.phone || 'Sem celular'}
              </span>
            </ItemPhone>
          )}
          
          <ItemMeta>
            <Calendar size={12} />
            <span>
              Criado em: {new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR')}
            </span>
          </ItemMeta>
          
          {isDocument && item.status && (
            <div className="status-badge">
              {item.status}
            </div>
          )}
        </ItemContent>
      </ItemHeader>

      {onRemove && (
        <RemoveButton 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
        >
          <Trash />
        </RemoveButton>
      )}
    </ItemCard>
  );
};