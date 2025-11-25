import { forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

/**
 * Wrapper de Link que encaminha a ref (ref forwarding).
 * * Isso é necessário ao usar o componente Link do react-router-dom
 * dentro da prop 'as' de componentes como Button ou Nav.Link do react-bootstrap.
 * O TypeScript exige que o componente passado via 'as' possa encaminhar a ref,
 * e a interface nativa do Link com react-bootstrap causa conflitos.
 */
// Estendemos as props do Link e garantimos que ele aceita a prop 'to'
interface RouterLinkProps extends Omit<LinkProps, 'to'> {
  to: string; 
  // Opcionalmente, 'href' é adicionado para satisfazer a tipagem de componentes como Nav.Link/Button.
  href?: string; 
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ to, children, ...rest }, ref) => (
    <Link ref={ref} to={to} {...rest}>
      {children}
    </Link>
  )
);

RouterLink.displayName = 'RouterLink';

export default RouterLink;