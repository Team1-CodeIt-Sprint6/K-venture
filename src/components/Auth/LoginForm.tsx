import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import ErrorText from '@/components/common/ErrorText';
import Input from '@/components/common/Input';
import Label from '@/components/common/Label';
import Modal from '@/components/common/Modal/Modal';
import useLogIn from '@/hooks/useLogin';
import useModal from '@/hooks/useModal';
import { loginSchema } from '@/lib/utils/authSchema';
import { LogInForm } from '@/types/AuthTypes';

import PasswordInput from './PasswordInput';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LogInForm>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  const { modalProps, openModal } = useModal();

  const mutation = useLogIn(openModal);

  const onSubmit: SubmitHandler<LogInForm> = async (data) => {
    await mutation.mutateAsync(data);
  };

  return (
    <>
      <Modal {...modalProps} />
      <form
        className={`${modalProps.isOpen && 'z-[-1]'} flex w-[100%] flex-col gap-[32px]`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-6">
          <div className="grid gap-[10px]">
            <Label htmlFor="email" className="flex flex-col gap-3">
              이메일
              <Input
                type="text"
                id="email"
                placeholder="이메일을 입력해 주세요"
                {...register('email')}
                validationCheck={!!errors.email}
              />
              {errors.email?.message && (
                <ErrorText>{errors.email?.message}</ErrorText>
              )}
            </Label>
          </div>
          <div className="grid gap-[10px]">
            <Label htmlFor="password" className="relative flex flex-col gap-3">
              비밀번호
              <PasswordInput
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                {...register('password')}
                validationCheck={!!errors.password}
              />
            </Label>
            {errors.password && (
              <ErrorText>{errors.password?.message}</ErrorText>
            )}
          </div>
        </div>
        <Button
          disabled={!isValid || mutation.isPending}
          className={`${!isValid || mutation.isPending ? 'bg-kv-gray-600 text-white' : 'bg-kv-primary-blue text-white'}`}
        >
          로그인 하기
        </Button>
      </form>
    </>
  );
}
