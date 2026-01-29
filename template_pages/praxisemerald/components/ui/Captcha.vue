<script setup lang="ts">
import { ref, onMounted } from 'vue';

type CaptchaProps = {
  a: number;
  b: number;
  minSubmitMs?: number;
};

const props = defineProps<CaptchaProps>();
const { a, b, minSubmitMs = 3000 } = props;

const start = ref<number>(Date.now());
const answer = ref<string>('');
const error = ref<string | null>(null);

// Generate unique IDs for inputs
const honeypotId = `honeypot-${Math.random().toString(36).substr(2, 9)}`;
const answerId = `answer-${Math.random().toString(36).substr(2, 9)}`;
const timeId = `time-${Math.random().toString(36).substr(2, 9)}`;

onMounted(() => {
  start.value = Date.now();
});
</script>

<template>
  <fieldset class="space-y-2">
    <legend class="text-sm font-medium text-slate-900">Spam-Schutz</legend>
    <p :id="`${answerId}-desc`" class="text-xs text-slate-600">
      Bitte lösen Sie die Rechenaufgabe, damit wir wissen, dass Sie ein Mensch sind.
    </p>
    <div class="flex items-center gap-2">
      <span class="text-sm text-slate-700">
        {{ a }} + {{ b }} =
      </span>
      <input
        :id="answerId"
        name="captchaAnswer"
        inputmode="numeric"
        pattern="[0-9]*"
        :aria-describedby="`${answerId}-desc`"
        class="block w-24 rounded-md border px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
        v-model="answer"
        required
      />
    </div>
    <p v-if="error" role="alert" class="text-xs text-red-700">
      {{ error }}
    </p>
    <!-- Hidden anti-spam fields -->
    <input type="text" name="website" :id="honeypotId" class="hidden" tabindex="-1" autocomplete="off" />
    <input type="hidden" name="captchaA" :value="a" />
    <input type="hidden" name="captchaB" :value="b" />
    <input type="hidden" name="captchaStartedAt" :id="timeId" :value="start.toString()" />
    <input type="hidden" name="minSubmitMs" :value="minSubmitMs.toString()" />
  </fieldset>
</template>