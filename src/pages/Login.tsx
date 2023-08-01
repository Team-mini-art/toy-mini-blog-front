import Input from '../components/Input';
import Button from '../components/Button';
import { AiFillLock } from 'react-icons/Ai';
import { useRef } from 'react';
import { useForm } from '../hooks/useFormHook';
// import { useNavigate } from 'react-router-dom';
import { postAuthLogin } from '../api/auth';
import { type LoginRes } from '../types/authType';
import { login } from '../store/features/auth/authSlice';
import { useDispatch } from 'react-redux';

export default function Login() {
  // const navigate = useNavigate();

  const dispatch = useDispatch();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const refs: Record<string, React.RefObject<HTMLInputElement>> = {
    email: emailRef,
    password: passwordRef,
  };

  const { handleSubmit, form, handleInputChange, error, errorMessage } =
    useForm({
      initialValues: {
        email: '',
        password: '',
      },
      refs,
      onSubmit: async (): Promise<LoginRes> => {
        const result = await postAuthLogin(form);
        return result;
      },
      onErrors: () => {
        console.log('error');
      },
      onSuccess: (userInfo) => {
        // TODO if 지우기
        if ('tokenInfo' in userInfo) {
          const {
            nickname,
            email,
            tokenInfo: { accessToken, refreshToken },
          } = userInfo;
          alert('Log In is complete.');
          dispatch(login({ nickname, email, accessToken, refreshToken }));
          // navigate('/');
        }
      },
    });

  return (
    <div className="container-basic shadow_type1 w-[37.5rem]">
      <h1 className="container-title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <Input
            labelClass="w-full text-xl text-basic"
            inputClass="mt-2 rounded-2xl"
            name="email"
            value={form.email}
            placeholder="Enter Email"
            onChange={handleInputChange}
            refs={refs}
            error={error}
          >
            Email
          </Input>
          <Input
            labelClass="mt-7 w-full text-xl text-basic"
            inputClass="mt-2 rounded-2xl"
            type="password"
            name="password"
            value={form.password}
            placeholder="Enter Password"
            onChange={handleInputChange}
            refs={refs}
            error={error}
          >
            Password
          </Input>
          {errorMessage !== '' && (
            <p className="mt-5 text-xl text-red-500">{`Please check your ${errorMessage}`}</p>
          )}
          <Button
            addClass="mt-12 py-6 px-10 flex justify-evenly items-center text-3xl font-semibold text-purple-500"
            type="submit"
          >
            Log In <AiFillLock className="ml-3" />
          </Button>
        </div>
      </form>
    </div>
  );
}
