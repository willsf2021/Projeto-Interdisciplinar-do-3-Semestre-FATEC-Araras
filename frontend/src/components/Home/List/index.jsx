// components/Home/List/index.jsx
import React from "react";
import { ListItem } from "../ListItem";
import { ListContainer, ListGrid, ListHeader } from "./style";

export const List = ({ type, items, searchTerm, onItemClick, onRemove }) => {
  // Filtrar itens baseado no termo de busca
  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Busca mais flexível baseada na estrutura real
    if (type === 'documents') {
      return (
        (item.name || item.nome || item.titulo || '').toLowerCase().includes(searchLower) ||
        (item.description || item.descricao || '').toLowerCase().includes(searchLower) ||
        (item.id || '').toString().toLowerCase().includes(searchLower)
      );
    } else {
      // Para clientes
      return (
        (item.nome_completo || item.name || item.nome || item.razao_social || '').toLowerCase().includes(searchLower) ||
        (item.email || item.email_contato || '').toLowerCase().includes(searchLower) ||
        (item.celular || item.telefone || '').toString().toLowerCase().includes(searchLower) ||
        (item.id || '').toString().toLowerCase().includes(searchLower)
      );
    }
  });

  if (filteredItems.length === 0) {
    return (
      <ListContainer>
        <div style={{ 
          padding: theme.spacing.xl, 
          textAlign: "center", 
          color: theme.colors.textColorMuted,
          fontStyle: "italic"
        }}>
          {searchTerm 
            ? `Nenhum ${type === 'documents' ? 'documento' : 'cliente'} encontrado para "${searchTerm}"`
            : `Nenhum ${type === 'documents' ? 'documento' : 'cliente'} cadastrado`
          }
        </div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        {searchTerm 
          ? `${filteredItems.length} ${type === 'documents' ? 'documento(s) encontrado(s)' : 'cliente(s) encontrado(s)'}`
          : `${filteredItems.length} ${type === 'documents' ? 'documento(s)' : 'cliente(s)'} cadastrado(s)`
        }
      </ListHeader>
      
      <ListGrid>
        {filteredItems.map((item) => (
          <ListItem
            key={item.id}
            type={type}
            item={item}
            onClick={() => onItemClick && onItemClick(item)}
            onRemove={onRemove}
          />
        ))}
      </ListGrid>
    </ListContainer>
  );
};