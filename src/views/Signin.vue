<template>
  <div>
    <h1>Signin</h1>
    <form @submit.prevent="signin">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Signin</button>
    </form>
    <div class="space-x-4">
      <router-link to="/signup" class="text-blue-600 underline">Signup</router-link>
      <router-link to="/pedagogie" class="text-blue-600 underline">Pédagogie</router-link>
    </div>
  </div>
</template>
