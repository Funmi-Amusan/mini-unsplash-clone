<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ImageSkeleton from './components/ImageSkeleton.vue';
import ImageModal from './components/ImageModal.vue';
import { getRowSpan } from './helpers';
import { Icon } from '@iconify/vue';
import type { Image } from './types';
import { fetchImagesAction } from './action';

const images = ref<Image[]>([]);
const showModal = ref(false);
const selectedImage = ref<Image | null>(null);
const limit = ref(12);
const query = ref('');
const tempQuery = ref(''); 
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

const openModal = (image: Image) => {
    selectedImage.value = image;
    showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedImage.value = null;
};

const fetchImages = async (isInitialLoad = false) => {
  if (loading.value || !hasMore.value) return;

  try {
    loading.value = true;
    const result = await fetchImagesAction(query.value, page.value, limit.value);
    
    if (result.images && result.images.length > 0) {
      if (isInitialLoad) {
        images.value = result.images;
      } else {
        images.value = [...images.value, ...result.images];
      }
      
      hasMore.value = result.hasMore;
      page.value++;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    hasError.value = true;
    errorMessage.value = 'An error occurred while fetching images.';
    hasMore.value = false;
  } 
    loading.value = false;
};

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const scrollThreshold = document.documentElement.scrollHeight - 500;

  if (scrollPosition >= scrollThreshold) {
    fetchImages();
  }
};

const clearSearch = () => {
  query.value = '';
  tempQuery.value = '';
  fetchImages(true);
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && tempQuery.value.length > 2) {
    query.value = tempQuery.value;
    page.value = 1;
    hasMore.value = true;
    fetchImages(true);
  }
};

onMounted(() => {
  fetchImages(true);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main class="min-h-screen relative">
    <section class="h-56 bg-[#DDE3EB]">
      <div class="flex justify-center items-center h-full">
        <div v-if="loading && query.length > 2" class="w-full md:w-3/4 flex items-center justify-center p-4">
          <h1 class="text-[#233752] text-2xl md:text-4xl font-semibold font-sans ">
            Searching for <span class="text-[#6C798D]">"{{ query }}"</span>
          </h1>
        </div>
        <div v-else-if="!loading && query.length > 2" class="w-full flex flex-col space-y-8 text-center items-center cente p-4 md:text-start md:space-y-0 md:w-3/4  md:flex-row md:justify-between ">
          <h1 class="text-[#233752] text-3xl md:text-4xl font-semibold font-sans">
            Search Results for <span class="text-[#6C798D]">"{{ query }}"</span>
          </h1>
          <button type="button" class=" flex items-center gap-3 p-2 rounded-full bg-white/50" @click="clearSearch">
            <Icon icon="qlementine-icons:clear-16" width="18" height="18"  style="color: #6C798D" />Clear Search</button>
        </div>
        <div v-else class="w-3/4  flex flex-col gap-2">
  <div class="flex items-center bg-white gap-4 p-4 rounded-md">
    <Icon icon="prime:search" width="24" height="24" style="color: #acacac" />
    <input
      type="text"
      class="w-full rounded-md text-zinc-800 outline-none"
      placeholder="Search for photo"
      v-model="tempQuery"
      @keypress="handleKeyPress"
    />
  </div>
  <p class="text-sm text-gray-500 text-center md:text-start">Press Enter on your keyboard to search for photos</p>
</div>
      </div>
    </section>

    <section class="w-full md:absolute md:top-40">
      <div class=" mx-6 md:mx-[10vw] lg:mx-[20vw] py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[60px] gap-6 md:gap-20 md:gap-x-10" v-if="images.length < 1">
          <ImageSkeleton v-for="index in 6" :key="index" :class="[getRowSpan(index-1).span]" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 auto-rows-[60px] md:auto-rows-[45px] lg:auto-rows-[80px] gap-6 md:gap-y-8 md:gap-x-10" v-else>
          <div
            v-for="(image, index) in images"
            :key="image?.id"
            class="bg-gray-100 rounded-lg flex flex-col justify-end"
            :class="[getRowSpan(index).span]"
            @click="openModal(image)"
          >
            <div
              :style="{ backgroundImage: `url(${image?.urls?.regular})` }"
              class="relative h-full w-full bg-cover bg-center rounded-lg"
            >
              <div
                class="absolute bg-gradient-to-t from-black/50 via-black/10 to-transparent px-8 py-4 gap-2 rounded-xl w-full h-full flex flex-col justify-end"
              >
                <h1 class="capitalize font-medium text-base text-white">{{ image?.user.name }}</h1>
                <p class="font-md text-zinc-200 text-sm">{{ image?.user?.location }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center mt-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-if="!hasMore && images.length > 0" class="text-center mt-8 text-gray-500">
          No more images to load
        </div>
        <div v-if="hasError" class="text-center mt-8 text-red-500">
          {{ errorMessage }}
        </div>
      </div>
    </section>

    <ImageModal :show="showModal" :image="selectedImage" @close="closeModal" />
  </main>
</template>
