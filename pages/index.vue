<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Panel</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard :icon="DollarSign" title="Toplam Gelir" :value="formatCurrency(128430)" />
      <StatCard :icon="ShoppingCart" title="Siparişler" value="1,245" />
      <StatCard :icon="Users" title="Müşteriler" value="856" />
      <StatCard :icon="Activity" title="Büyüme" value="+12.5%" />
    </div>
    <div class="grid grid-cols-1 gap-6">
      <RecentSales />
    </div>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import StatCard from '~/components/StatCard.vue'
import RecentSales from '~/components/RecentSales.vue'
import { DollarSign, ShoppingCart, Users, Activity } from 'lucide-vue-next'
import { useCurrency } from '~/composables/useCurrency'

const { formatCurrency } = useCurrency()
</script>
