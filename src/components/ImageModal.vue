<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, onUnmounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import type { Image } from '../types';

const props = defineProps<{
  show: boolean;
  image: Image;
}>();

const emit = defineEmits(['close']);
const modalContent = ref<HTMLElement | null>(null);

const closeModal = () => {
  emit('close');
};

const handleClickOutside = (event: MouseEvent) => {
  if (modalContent.value && !modalContent.value.contains(event.target as Node)) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const isPortrait = computed(() => {
  return (props?.image?.height ?? 0) > (props?.image?.width ?? 0);
});

</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/30 flex items-center px-6 md:px-24 p-12 justify-center">
      <div 
         ref="modalContent"
  :class="{'pt-0 lg:pt-4': isPortrait, 'p-0': !isPortrait}" 
  :style="{ backgroundColor: image?.color }"
  class="rounded-xl w-full h-auto lg:h-full overflow-hidden">
        <button type="button" class="absolute hidden md:block top-2 right-8 p-4" @click="closeModal">
        <Icon icon="si:close-line" width="24" height="24" class="text-zinc-200 text-2xl" />
      </button>
        <div class="flex flex-col h-full">
          <div class="flex-grow w-full overflow-hidden">
            <img
            :src="image?.urls.full"
            :alt="image?.alt_description"
            :class="{'object-cover': !isPortrait, 'object-contain': isPortrait}"
            class="w-full h-full rounded-t-md"
          />
          </div>
          <div class="bg-white px-8 py-4 gap-4 rounded-b-xl w-full">
            <h1 class="capitalize font-medium text-xl">{{ image?.user.name }}</h1>
            <p class=" font-md text-zinc-400">{{ image?.user.location }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  