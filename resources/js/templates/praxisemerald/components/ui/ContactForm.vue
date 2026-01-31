<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const message = ref('');
</script>

<template>
    <form class="space-y-4" @submit.prevent>
        <div>
            <label for="contact-name" class="block text-sm font-medium text-slate-700">Name</label>
            <input
                id="contact-name"
                v-model="name"
                type="text"
                class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
        </div>
        <div>
            <label for="contact-email" class="block text-sm font-medium text-slate-700">E-Mail</label>
            <input
                id="contact-email"
                v-model="email"
                type="email"
                class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
        </div>
        <div>
            <label for="contact-message" class="block text-sm font-medium text-slate-700">Nachricht</label>
            <textarea
                id="contact-message"
                v-model="message"
                rows="4"
                class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
        </div>
        <button
            type="submit"
            class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
            Nachricht senden
        </button>
    </form>
</template>
