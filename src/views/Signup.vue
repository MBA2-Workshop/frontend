<template>
  <div>
    <h1>Signup</h1>
    <form @submit.prevent="signup">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm Password" />
      <button type="submit">Signup</button>
    </form>
    <div class="space-x-4">
      <router-link to="/" class="text-blue-600 underline">Signin</router-link>
      <router-link to="/pedagogie" class="text-blue-600 underline">Pédagogie</router-link>
    </div>
  </div>
</template>
