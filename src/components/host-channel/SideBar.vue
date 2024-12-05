<template>
  <div class="container">
    <div v-for="category in props.categories"
         :key="category.id"
         @click="handleMenuClick(category)">
      <router-link class="menu-item" :to="category.link">
        <span>{{ category.name }}</span>
        <FontAwesomeIcon :icon="faChevronRight"/>
      </router-link>
      <div v-if="isSubmenuVisible === category.id" class="submenu">
        <div class="submenu-item"
             v-for="submenu in props.submenus[category.id]"
             :key="submenu.id">
          <router-link :to="submenu.link">{{ submenu.name }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  submenus: {
    type: Array,
    required: false,
    default: () => {
      return [];
    },
  },
});

const isSubmenuVisible = ref(null);

const handleMenuClick = (category) => {
  if (props.submenus[category.id]) {
    isSubmenuVisible.value = category.id;
  } else {
    isSubmenuVisible.value = null;
  }
};
</script>

<style scoped>

a {
  text-decoration: none;
  color: #333333;
}
.menu-item {
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submenu {
  padding: 10px 10px 10px 20px;
  background-color: #f1f1f1;
  font-weight: normal;
  margin-top: 5px;
  border-radius: 5px;
}

.submenu-item {
  padding: 8px;
}

.submenu-item a {
  text-decoration: none;
  color: #333;
}

.container {
  padding-top: 10px;
  padding-bottom: 15px;
}

</style>
