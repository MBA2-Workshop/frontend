<script setup>
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";
import axiosInstance from "../services/axiosInstance";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const error = ref(null);

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

const validateFields = () => {
  let isValid = true;

  if (!email.value) {
    emailError.value = "L'adresse email est requise.";
    isValid = false;
  } else if (!validateEmail(email.value)) {
    emailError.value = "L'adresse email n'est pas valide.";
    isValid = false;
  } else {
    emailError.value = "";
  }

  if (!password.value) {
    passwordError.value = "Le mot de passe est requis.";
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = "Le mot de passe doit contenir au moins 6 caractères.";
    isValid = false;
  } else {
    passwordError.value = "";
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = "La confirmation du mot de passe est requise.";
    isValid = false;
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = "Les mots de passe ne correspondent pas.";
    isValid = false;
  } else {
    confirmPasswordError.value = "";
  }

  return isValid;
};

const signin = async () => {
  if (!validateFields()) {
    return;
  }
  try {
    const response = await axiosInstance.post('/user/signup/', {
      username: email.value,
      email: email.value,
      first_name: "John",
      last_name: "Doe",
      password: password.value
    });
    error.value = null;
    userStore.setUser(response.data.user);
    userStore.setAccessToken(response.data.access);
    userStore.setRefreshToken(response.data.refresh);
    router.push({ name: 'Pedagogie' });
  } catch (err) {
    error.value = err.response ? err.response.data : "Une erreur s'est produite. Veuillez réessayer.";
  }
};
</script>

<template>
  <div class="flex justify-center items-center h-screen place-content-center">
    <div class="flex flex-col justify-center p-6 shadow bg-neutral-0 w-96 rounded-xl gap-2">
      <img src="../assets/logo_carre.png" alt="Logo" class="h-12 w-12 mx-auto" />
      <h1 class="text-3xl font-bold text-center">Inscription</h1>
      <div v-if="error" class="text-red-500 text-center text-sm mt-2">{{ error }}</div>
      <form @submit.prevent="signin" class="space-y-4">
        <div>
          <label>
            <span class="block">Email</span>
            <input type="email" v-model="email" placeholder="Addresse email"
              :class="['w-full p-2 border rounded', emailError ? 'border-red-500' : 'border-neutral-300']" />
            <span v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</span>
          </label>
        </div>
        <div>
          <label>
            <span class="block">Mot de passe</span>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Mot de passe"
                :class="['w-full p-2 border rounded', passwordError ? 'border-red-500' : 'border-neutral-300']" />
              <button type="button" class="absolute inset-y-0 right-0 p-2" @click="showPassword = !showPassword">
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <span v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</span>
          </label>
        </div>
        <div>
          <label>
            <span class="block">Confirmer le mot de passe</span>
            <div class="relative">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                placeholder="Confirmer le mot de passe"
                :class="['w-full p-2 border rounded', confirmPasswordError ? 'border-red-500' : 'border-neutral-300']" />
              <button type="button" class="absolute inset-y-0 right-0 p-2"
                @click="showConfirmPassword = !showConfirmPassword">
                <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <span v-if="confirmPasswordError" class="text-red-500 text-sm">{{ confirmPasswordError }}</span>
          </label>
        </div>
        <button type="submit" class="w-full p-2 bg-business-700 text-neutral-0 rounded">Inscription</button>
      </form>
      <router-link to="/" class="text-end text-business-700 hover:underline">Déjà inscrit ?</router-link>
    </div>
  </div>
</template>
