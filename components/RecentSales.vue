<template>
  <div class="bg-card p-6 rounded-xl">
    <h3 class="text-xl font-semibold text-text-primary mb-4">Son Satışlar</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-border-color text-text-secondary">
            <th class="py-3 px-4 font-semibold">Müşteri</th>
            <th class="py-3 px-4 font-semibold">Email</th>
            <th class="py-3 px-4 font-semibold">Tutar</th>
            <th class="py-3 px-4 font-semibold">Tarih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in formattedSales" :key="sale.id" class="border-b border-border-color hover:bg-background/50 transition-colors">
            <td class="py-4 px-4 flex items-center gap-3">
              <img :src="sale.avatar" class="w-10 h-10 rounded-full" />
              <span class="font-medium text-text-primary">{{ sale.name }}</span>
            </td>
            <td class="py-4 px-4 text-text-secondary">{{ sale.email }}</td>
            <td class="py-4 px-4 font-semibold text-text-primary">{{ sale.formattedAmount }}</td>
            <td class="py-4 px-4 text-text-secondary">{{ sale.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'

const { formatCurrency } = useCurrency()

const sales = ref([
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet.y@example.com', amount: 2450.00, date: '24 Mayıs 2024', avatar: 'https://i.pravatar.cc/40?u=a' },
  { id: 2, name: 'Ayşe Kaya', email: 'ayse.k@example.com', amount: 1280.50, date: '23 Mayıs 2024', avatar: 'https://i.pravatar.cc/40?u=b' },
  { id: 3, name: 'Mehmet Demir', email: 'mehmet.d@example.com', amount: 890.00, date: '23 Mayıs 2024', avatar: 'https://i.pravatar.cc/40?u=c' },
  { id: 4, name: 'Fatma Çelik', email: 'fatma.c@example.com', amount: 5600.75, date: '22 Mayıs 2024', avatar: 'https://i.pravatar.cc/40?u=d' },
  { id: 5, name: 'Ali Vural', email: 'ali.v@example.com', amount: 320.00, date: '21 Mayıs 2024', avatar: 'https://i.pravatar.cc/40?u=e' },
])

const formattedSales = computed(() => {
  return sales.value.map(sale => ({
    ...sale,
    formattedAmount: formatCurrency(sale.amount)
  }))
})
</script>
