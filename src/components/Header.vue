<script setup>
import { BellIcon, MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
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
    <div class="flex space-x-2 items-center cursor-pointer">
      <div class="p-2 bg-neutral-0 rounded-full">
        <UserIcon class="size-5 rounded-full" />
      </div>
      <span class="text-sm">Établissement</span>
      <ChevronDownIcon class="size-5" />
    </div>
  </header>
</template>
