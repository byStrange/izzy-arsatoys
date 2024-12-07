<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold">Admin Dashboard</h2>
    
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <h3 class="text-xl font-semibold mb-4">Recent Orders</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="text-left py-2">Order ID</th>
              <th class="text-left py-2">Customer</th>
              <th class="text-left py-2">Total</th>
              <th class="text-left py-2">Status</th>
              <th class="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="py-2">{{ order.id }}</td>
              <td>{{ order.customerName }}</td>
              <td>${{ order.totalAmount.toFixed(2) }}</td>
              <td>{{ order.status }}</td>
              <td>
                <button @click="updateOrderStatus(order.id, 'completed')"
                        class="text-green-500 hover:text-green-600 mr-2">
                  Complete
                </button>
                <button @click="updateOrderStatus(order.id, 'cancelled')"
                        class="text-red-500 hover:text-red-600">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <h3 class="text-xl font-semibold mb-4">Categories</h3>
      <div class="space-y-4">
        <div v-for="category in categories" :key="category.id" 
             class="flex justify-between items-center">
          <span>{{ category.name }}</span>
          <div>
            <button @click="editCategory(category)"
                    class="text-primary-500 hover:text-primary-600 mr-2">
              Edit
            </button>
            <button @click="deleteCategory(category.id)"
                    class="text-red-500 hover:text-red-600">
              Delete
            </button>
          </div>
        </div>
        
        <form @submit.prevent="saveCategory" class="mt-4 space-y-4">
          <input v-model="newCategory.name" placeholder="Category Name"
                 class="w-full rounded-lg border-gray-300 dark:bg-gray-700" />
          <button type="submit" 
                  class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
            {{ editingCategory ? 'Update' : 'Add' }} Category
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readFileSync, writeFileSync } from 'fs'
import type { Category, Order } from '~/types'

const orders = ref<Order[]>([])
const categories = ref<Category[]>([])
const newCategory = ref({ name: '', slug: '' })
const editingCategory = ref(false)

const loadData = () => {
  const dbContent = JSON.parse(readFileSync('./database.json', 'utf-8'))
  orders.value = dbContent.orders
  categories.value = dbContent.categories
}

const saveCategory = () => {
  const slug = newCategory.value.name.toLowerCase().replace(/\s+/g, '-')
  const category = {
    id: Date.now().toString(),
    name: newCategory.value.name,
    slug
  }
  
  const dbContent = JSON.parse(readFileSync('./database.json', 'utf-8'))
  dbContent.categories.push(category)
  writeFileSync('./database.json', JSON.stringify(dbContent, null, 2))
  
  categories.value.push(category)
  newCategory.value = { name: '', slug: '' }
}

const updateOrderStatus = (orderId: string, status: 'completed' | 'cancelled') => {
  const dbContent = JSON.parse(readFileSync('./database.json', 'utf-8'))
  const order = dbContent.orders.find((o: Order) => o.id === orderId)
  if (order) {
    order.status = status
    writeFileSync('./database.json', JSON.stringify(dbContent, null, 2))
    loadData()
  }
}

onMounted(() => {
  loadData()
})
</script>