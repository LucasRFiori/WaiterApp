import { Actions, ModalBody, OrderDetails, Overlay } from './styles';
import closeIcon from '../../assets/images/close-icon.svg';
import { Order } from '../../types/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import { useEffect } from 'react';

interface OrderModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onCancelOrder: () => void;
  isLoading: boolean;
  onChangeOrderStatus: () => void;
}

interface OrderStatus {
  [key: string]: {
    status: string;
    icon: string;
  }
}

const orderStatus: OrderStatus = {
  'WAITING': {
    status: 'Fila de espera',
    icon: '🕐'
  },
  'IN_PRODUCTION': {
    status: 'Em preparação',
    icon: '👨‍🍳'
  },
  'DONE': {
    status: 'Pronto!',
    icon: '✅'
  }
};

export function OrderModal({
  visible,
  order,
  onClose,
  onCancelOrder,
  isLoading,
  onChangeOrderStatus
}: OrderModalProps) {

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if(e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if(!visible || !order) return <></>;

  const total = order.products.reduce((total, { product, quantity }) => {
    return total + (product.price * quantity);
  }, 0);

  return (
    <Overlay>
      <ModalBody>
        <header>
          <strong>Mesa {order?.table}</strong>
          <button type='button'><img src={closeIcon} alt='close button' onClick={onClose}/></button>
        </header>

        <div className="status-container">
          <small>Status do Pedido</small>
          <div>
            <span>{orderStatus[order?.status].icon}</span>
            <strong>{orderStatus[order.status].status}</strong>
          </div>
        </div>

        <OrderDetails>
          <strong>Itens</strong>

          <div className="order-items">
            {order.products.map(({_id, product, quantity}) => (
              <div className="item" key={_id}>
                <img
                  src={`http://localhost:3001/uploads/${product.imagePath}`}
                  alt={product.name}
                  width="56"
                  height="28.51"
                />

                <span className="quantity">{quantity}x</span>

                <div className="product-details">
                  <strong>{product.name}</strong>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </div>
            ))}


            <div className="total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        </OrderDetails>

        <Actions>
          {order.status != 'DONE' && (
            <button
              type='button'
              className='primary'
              disabled={isLoading}
              onClick={onChangeOrderStatus}
            >
              <span>{order.status === 'IN_PRODUCTION' ? '✅' : '👨‍🍳'}</span>
              <strong>{order.status === 'IN_PRODUCTION' ? 'Concluído' : 'Iniciar Produção'}</strong>
            </button>
          )}

          <button
            type='button'
            className='secundary'
            onClick={onCancelOrder}
            disabled={isLoading}
          >
            <strong>Cancelar pedido</strong>
          </button>

        </Actions>
      </ModalBody>
    </Overlay>
  );
}
