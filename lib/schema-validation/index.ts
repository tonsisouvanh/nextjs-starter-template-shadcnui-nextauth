import { z } from 'zod';

export const orderFormSchema = z.object({
  shop_id: z.string().min(1, 'ກະລຸນາເລືອກຊື່ຮ້ານຄ້າ'),
  event_id: z.string().min(1, 'ກະລຸນາເລືອກປະເພດການຈັດງານ'),
  user_name: z
    .string()
    .min(1, 'ກະລຸນາໃສ່ຊື່ ແລະ ນາມສະກຸນ')
    .regex(/^[a-zA-Z\u0E80-\u0EFF\s]+$/, 'ກາລຸນາປ້ອນໂຕໜັງສືເທົ່ານັ້ນ'),
  user_phone: z
    .string()
    .min(10, 'ເບີໂທຕ້ອງມີ 10 ໂຕເລກ: 20xxxxxxxx')
    .max(10, 'ເບີໂທຕ້ອງມີ 10 ໂຕເລກ: 20xxxxxxxx')
    .regex(/^\d+$/, 'ກະລຸນາໃສ່ເລກເທົ່ານັ້ນ'),
  day: z.string().min(1, 'ກະລຸນາເລືອກວັນ'),
  month: z.string().min(1, 'ກະລຸນາເລືອກເດືອນ'),
  year: z.string().min(1, 'ກະລຸນາເລືອກປີ'),
  user_gender: z.string().min(1, 'ກະລຸນາເລືອກເພດ'),
  user_province: z.string().min(1, 'ກະລຸນາເລືອກແຂວງ'),
  user_district: z.string().min(1, 'ກະລຸນາເລືອກເມືອງ'),
  user_village: z
    .string()
    .min(1, 'ກະລຸນາໃສ່ບ້ານຢູ່ປະຈຸບັນ')
    .regex(/^[a-zA-Z\u0E80-\u0EFF\s]+$/, 'ກາລຸນາປ້ອນໂຕໜັງສືເທົ່ານັ້ນ'),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'ກະລຸນາຍອມຮັບເງື່ອນໄຂ',
  }),
});
