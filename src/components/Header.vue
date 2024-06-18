<script setup>
import { BellIcon, MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const showMenu = ref(false);

const logout = () => {
  userStore.logout();
  router.push({ name: 'Signin' });
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const closeMenu = () => {
  showMenu.value = false;
};

const menuRef = ref(null);
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    closeMenu();
  }
};

window.addEventListener('click', handleClickOutside);
</script>

<template>
  <header class="flex justify-end items-center py-4 px-8 space-x-4">
    <div class="p-2 bg-neutral-0 rounded-full cursor-pointer hover:bg-neutral-100">
      <MagnifyingGlassIcon class="size-5" />
    </div>
    <div class="p-2 bg-neutral-0 rounded-full cursor-pointer hover:bg-neutral-100">
      <BellIcon class="size-5" />
    </div>
    <div class="w-0.5 h-full bg-[#D9D9D9]"></div>
    <div ref="menuRef" class="relative">
      <div @click="toggleMenu" class="flex space-x-2 items-center cursor-pointer">
        <div class="p-2 bg-neutral-0 rounded-full">
          <UserIcon class="size-5 rounded-full" />
        </div>
        <span class="text-sm">Établissement</span>
        <ChevronDownIcon class="size-5" />
      </div>
      <div v-if="showMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
        <ul class="py-2">
          <li @click="logout" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Déconnexion</li>
        </ul>
      </div>
    </div>
  </header>
</template>
