import { useMutation } from '@tanstack/react-query';
import {
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from './api';
import type { LoginFormValues, RegisterFormValues } from '@/utils/validators';

export function useEmailLogin() {
  return useMutation({
    mutationFn: ({ email, password }: LoginFormValues) => signInWithEmail(email, password),
  });
}

export function useEmailRegister() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => signUpWithEmail(values),
  });
}

export function useAppleSignIn() {
  return useMutation({ mutationFn: signInWithApple });
}

export function useGoogleSignIn() {
  return useMutation({ mutationFn: signInWithGoogle });
}

export function useSignOut() {
  return useMutation({ mutationFn: signOut });
}
