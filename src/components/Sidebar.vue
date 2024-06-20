<script setup>
import { AcademicCapIcon, HomeIcon, BuildingOffice2Icon, CpuChipIcon, DocumentIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="min-h-screen bg-white w-48 p-4 flex flex-col">
    <div class="mb-8">
      <img src="../assets/logo_carre.png" alt="Logo" class="h-12 w-12 mx-auto" />
    </div>
    <nav class="flex flex-col space-y-1">
      <div to="/" class="flex items-center p-3 text-neutral-400 rounded-xl cursor-default">
        <HomeIcon class="size-5" />
        <span class="ml-4 text-sm">Accueil</span>
      </div>
      <div to="/" class="flex items-center p-3 text-neutral-400 rounded-xl cursor-default">
        <AcademicCapIcon class="size-5" />
        <span class="ml-4 text-sm">Étudiants</span>
      </div>
      <div to="/" class="flex items-center p-3 text-neutral-400 rounded-xl cursor-default">
        <BuildingOffice2Icon class="size-5" />
        <span class="ml-4 text-sm">Partenaires</span>
      </div>
      <div to="/" class="flex items-center p-3 text-neutral-400 rounded-xl cursor-default">
        <DocumentIcon class="size-5" />
        <span class="ml-4 text-sm">Contrats</span>
      </div>
      <router-link to="/pedagogie"
        class="flex items-center p-3 hover:bg-business-400 hover:text-neutral-0 rounded-xl bg-business-700 text-neutral-0">
        <AcademicCapIcon class="size-5" />
        <span class="ml-4 text-sm">Pédagogie</span>
      </router-link>
      <div class="flex items-center p-3 text-neutral-400 rounded-xl cursor-default">
        <CpuChipIcon class="size-5" />
        <span class="ml-4 text-sm">Ernest</span>
      </div>
    </nav>
  </div>
</template>
