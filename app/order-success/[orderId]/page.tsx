import ContactInfo from '@/components/ContactInfo';
import OrderSuccessResult from '@/components/OrderSuccessResult';
export default function OrderSuccessPage() {
  return (
    <div className="bg-color-11 mx-auto max-w-lg">
      <OrderSuccessResult />
      <ContactInfo className="bg-transparent" />
    </div>
  );
}
