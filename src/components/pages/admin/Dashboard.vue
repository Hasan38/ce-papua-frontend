<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { CountZona, CountCustomer, CountCustomerType } from '/@src/models/dashboard'
import { useThemeColors } from '/@src/composable/useThemeColors'
import { type OptionsCountCustomerPie } from '/@src/models/chartPie'
import { type OptionsCountCustomerBar } from '/@src/models/chartBar'
import { useUserSession } from '/@src/stores/userSession'
import sleep from '/@src/utils/sleep'
import { useAreaGroup } from '/@src/services/get-areaGroup'
import { type Machine } from '/@src/models/machine'

const themeColors = useThemeColors()
const $fetch = useLaravelFetch()
const userSession = useUserSession()
const modalFilter = ref(false)
const modalZona = ref(false)
const route = useRoute()
const zona = ref(0)
const machineData = ref<Machine[]>()
const area_id = ref(userSession.user?.area_id ?? 1)
const totalMachine = ref()
const area_name = ref(userSession.user?.area_name ?? 'Jayapura')
const currentPage = ref(0)
computed({
  get() {
    currentPage.value = Number.parseInt(route.query.page as string) || 1
    return currentPage.value
  },
  set(val) {
    currentPage.value = val
  },
})
interface Response {
  success: boolean
  data: {
    count_customer: CountCustomer[]
    count_zona: CountZona
    count_customer_type: CountCustomerType[]
  }
}

interface MachineResponse {
  success: boolean
  data: {
    current_page: number
    data: Machine[]
    per_page: number
    total: number
  }
}

const optionsCountCustomerPie = ref<OptionsCountCustomerPie>()
const optionsCountCustomerBar = ref<OptionsCountCustomerBar>()
const optionsCountCustomerHorizontalBar = ref<OptionsCountCustomerBar>()
const count_zonas = ref<CountZona>()
const isLoading = ref(false)
const data = await $fetch<Response>(`/api/dashboard?area_id=${area_id.value}`)
count_zonas.value = data.data.count_zona
const count_customer = data.data.count_customer?.map(function (item) {
  return {
    x: item.name,
    y: item.total,
  }
})
const count_customer_type = data.data.count_customer_type?.map(function (item) {
  return {
    x: item.customer_type,
    y: item.total,
  }
})
optionsCountCustomerPie.value = {
  series: count_customer.map(val => parseInt(val.y)),
  chartOptions: {
    labels: count_customer.map(val => val.x),

    chart: {
      height: 400,
      type: 'donut',
      toolbar: {
        show: true,
      },

    },
    color: {
      pattern: [
        themeColors.success,
        themeColors.info,
        themeColors.warning,
        themeColors.danger,
        themeColors.purple,
        themeColors.blue,
        themeColors.green,
        themeColors.yellow,
        themeColors.orange,
        themeColors.lightText,
        themeColors.fadeGrey,
        themeColors.primary,
        themeColors.primaryMedium,
        themeColors.primaryLight,
        themeColors.secondary,
        themeColors.accent,
        themeColors.accentMedium,
        themeColors.accentLight,

      ],
      threshold: {
        values: [30, 60, 90, 100],
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function (val: any, opts: any) {
        return val + ' - ' + opts.w.globals.series[opts.seriesIndex]
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  },
}

optionsCountCustomerBar.value = {
  series: [{
    data: count_customer.map(val => val.y),
  }],
  chart: {
    type: 'bar',
    height: 380,
  },
  fill: {
    type: 'gradient',
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'bottom',
      },
    },
  },
  color: {
    pattern: [
      themeColors.success,
      themeColors.info,
      themeColors.warning,
      themeColors.danger,
      themeColors.purple,
      themeColors.blue,
      themeColors.green,
      themeColors.yellow,
      themeColors.orange,
      themeColors.lightText,
      themeColors.fadeGrey,
      themeColors.primary,
      themeColors.primaryMedium,
      themeColors.primaryLight,
      themeColors.secondary,
      themeColors.accent,
      themeColors.accentMedium,
      themeColors.accentLight,

    ],
    threshold: {
      values: [30, 60, 90, 100],
    },
  },
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      colors: ['#fff'],
    },
    formatter: function (val: any, opt: any) {
      return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
    },
    offsetX: 0,
    dropShadow: {
      enabled: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff'],
  },
  xaxis: {
    categories: count_customer.map(val => val.x),
  },
  yaxis: {
    labels: {
      show: false,
    },
  },

  tooltip: {
    theme: 'dark',
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function () {
          return ''
        },
      },
    },
  },
}
optionsCountCustomerHorizontalBar.value = {
  series: [{
    data: count_customer_type.map(val => val.y),
  }],
  chart: {
    type: 'bar',
    height: 380,
  },
  fill: {
    type: 'gradient',
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'bottom',
      },
    },
  },
  color: {
    pattern: [
      themeColors.success,
      themeColors.info,
      themeColors.warning,
      themeColors.danger,
      themeColors.purple,
      themeColors.blue,
      themeColors.green,
      themeColors.yellow,
      themeColors.orange,
      themeColors.lightText,
      themeColors.fadeGrey,
      themeColors.primary,
      themeColors.primaryMedium,
      themeColors.primaryLight,
      themeColors.secondary,
      themeColors.accent,
      themeColors.accentMedium,
      themeColors.accentLight,

    ],
    threshold: {
      values: [30, 60, 90, 100],
    },
  },
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      colors: ['#fff'],
    },
    formatter: function (val: any, opt: any) {
      return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
    },
    offsetX: 0,
    dropShadow: {
      enabled: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff'],
  },
  xaxis: {
    categories: count_customer_type.map(val => val.x),
  },
  yaxis: {
    labels: {
      show: false,
    },
  },

  tooltip: {
    theme: 'dark',
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function () {
          return ''
        },
      },
    },
  },
}

const onFilter = async () => {
  currentPage.value = 0
  if (isLoading.value) return
  isLoading.value = true
  sleep(1000)
  await $fetch<Response>(`/api/dashboard?area_id=${area_id.value}`).then(((res) => {
    modalFilter.value = false
    isLoading.value = false
    count_zonas.value = res.data.count_zona
    const count_customer = res.data.count_customer?.map(function (item) {
      return {
        x: item.name,
        y: item.total,
      }
    })
    const count_customer_type = res.data.count_customer_type?.map(function (item) {
      return {
        x: item.customer_type,
        y: item.total,
      }
    })
    optionsCountCustomerPie.value = {
      series: count_customer.map(val => val.y),
      chartOptions: {
        labels: count_customer.map(val => val.x),

        chart: {
          height: 400,
          type: 'donut',
          toolbar: {
            show: true,
          },

        },
        color: {
          pattern: [
            themeColors.success,
            themeColors.info,
            themeColors.warning,
            themeColors.danger,
            themeColors.purple,
            themeColors.blue,
            themeColors.green,
            themeColors.yellow,
            themeColors.orange,
            themeColors.lightText,
            themeColors.fadeGrey,
            themeColors.primary,
            themeColors.primaryMedium,
            themeColors.primaryLight,
            themeColors.secondary,
            themeColors.accent,
            themeColors.accentMedium,
            themeColors.accentLight,

          ],
          threshold: {
            values: [30, 60, 90, 100],
          },
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function (val: any, opts: any) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex]
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 400,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    }

    optionsCountCustomerBar.value = {
      series: [{
        data: count_customer.map(val => val.y),
      }],
      chart: {
        type: 'bar',
        height: 380,
      },
      fill: {
        type: 'gradient',
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      color: {
        pattern: [
          themeColors.success,
          themeColors.info,
          themeColors.warning,
          themeColors.danger,
          themeColors.purple,
          themeColors.blue,
          themeColors.green,
          themeColors.yellow,
          themeColors.orange,
          themeColors.lightText,
          themeColors.fadeGrey,
          themeColors.primary,
          themeColors.primaryMedium,
          themeColors.primaryLight,
          themeColors.secondary,
          themeColors.accent,
          themeColors.accentMedium,
          themeColors.accentLight,

        ],
        threshold: {
          values: [30, 60, 90, 100],
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val: any, opt: any) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: count_customer.map(val => val.x),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },

      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return ''
            },
          },
        },
      },
    }
    optionsCountCustomerHorizontalBar.value = {
      series: [{
        data: count_customer_type.map(val => val.y),
      }],
      chart: {
        type: 'bar',
        height: 380,
      },
      fill: {
        type: 'gradient',
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      color: {
        pattern: [
          themeColors.success,
          themeColors.info,
          themeColors.warning,
          themeColors.danger,
          themeColors.purple,
          themeColors.blue,
          themeColors.green,
          themeColors.yellow,
          themeColors.orange,
          themeColors.lightText,
          themeColors.fadeGrey,
          themeColors.primary,
          themeColors.primaryMedium,
          themeColors.primaryLight,
          themeColors.secondary,
          themeColors.accent,
          themeColors.accentMedium,
          themeColors.accentLight,

        ],
        threshold: {
          values: [30, 60, 90, 100],
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val: any, opt: any) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: count_customer_type.map(val => val.x),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },

      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return ''
            },
          },
        },
      },
    }
  }))
}

async function onSelect(option: any, id: any) {
  area_name.value = id.label
}

async function getMachineByZona(area_ids: any, zonas: any) {
  modalZona.value = true
  if (zona.value !== zonas) {
    currentPage.value = 0
  }
  zona.value = zonas
  isLoading.value = true

  await $fetch.raw<MachineResponse>('/api/dashboard/byzona', {
    method: 'GET',
    params: {
      area_id: area_ids,
      zona: zonas,
      page: currentPage.value,
      limit: 10,
    },
  }).then(((res) => {
    isLoading.value = false
    machineData.value = res._data?.data.data ?? []
    totalMachine.value = res._data?.data.total
  })).catch((e) => {
    console.log(e)
  })
}

</script>

<template>
  <div>
    <div class="personal-dashboard personal-dashboard-v3">
      <div class="columns">
        <div class="column is-12">
          <div class="stats-wrapper">
            <div class="columns is-multiline is-flex-tablet-p">
              <div class="column is-3">
                <div class="dashboard-card">
                  <VButton
                    icon="feather:filter"
                    color="info"
                    rounded
                    @click="modalFilter = true"
                  >
                    {{ area_name ?? userSession.user?.area_groups?.name }}
                    {{ +count_zonas?.zona_1! + +count_zonas?.zona_2! + +count_zonas?.zona_3! }}
                    Mesin
                  </VButton>
                </div>
              </div>
              <div class="column is-3">
                <div class="dashboard-card">
                  <VPlaceloadText
                    v-if="isLoading"
                    :lines="2"
                    width="75%"
                    last-line-width="25%"
                  />
                  <a v-else href="#">
                    <VBlock

                      :title="`${count_zonas?.zona_1} Mesin`"
                      subtitle="ZONA 1"
                      center
                      @click="getMachineByZona(area_id, 1)"
                    >
                      <template #icon>
                        <VIconBox
                          color="info"
                          rounded
                        >
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:clock"
                          />
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
              </div>
              <div class="column is-3">
                <div class="dashboard-card">
                  <VPlaceloadText
                    v-if="isLoading"
                    :lines="2"
                    width="75%"
                    last-line-width="25%"
                  />
                  <a v-else href="#">
                    <VBlock

                      :title="`${count_zonas?.zona_2} Mesin`"
                      subtitle="ZONA 2"
                      center
                      @click="getMachineByZona(area_id, 2)"
                    >
                      <template #icon>
                        <VIconBox
                          color="purple"
                          rounded
                        >
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:radio"
                          />
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
              </div>
              <div class="column is-3">
                <div class="dashboard-card">
                  <VPlaceloadText
                    v-if="isLoading"
                    :lines="2"
                    width="75%"
                    last-line-width="25%"
                  />
                  <a v-else href="#">
                    <VBlock

                      :title="`${count_zonas?.zona_3} Mesin`"
                      subtitle="ZONA 3"
                      center
                      @click="getMachineByZona(area_id, 3)"
                    >
                      <template #icon>
                        <VIconBox
                          color="green"
                          rounded
                        >
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:user-check"
                          />
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
              </div>
              <div class="column is-6">
                <div class="dashboard-card">
                  <VLoader size="large" :active="isLoading">
                    <ApexChart
                      id="interviews-chart-pie"
                      :height="optionsCountCustomerPie?.chartOptions.chart.height"
                      :type="optionsCountCustomerPie?.chartOptions.chart.type"
                      :series="optionsCountCustomerPie?.series ?? []"
                      :options="optionsCountCustomerPie?.chartOptions "
                    />
                  </VLoader>
                </div>
              </div>
              <div class="column is-6">
                <div class="dashboard-card">
                  <VLoader size="large" :active="isLoading">
                    <ApexChart
                      id="interviews-chart-bar"
                      :height="optionsCountCustomerBar?.chart.height"
                      :type="optionsCountCustomerBar?.chart.type"
                      :series="optionsCountCustomerBar?.series ?? []"
                      :options="optionsCountCustomerBar"
                    />
                  </VLoader>
                </div>
              </div>
              <div class="column is-12">
                <div class="dashboard-card">
                  <VLoader size="large" :active="isLoading">
                    <ApexChart
                      id="interviews-chart-hor-bar"
                      :height="optionsCountCustomerHorizontalBar?.chart.height"
                      :type="optionsCountCustomerHorizontalBar?.chart.type"
                      :series="optionsCountCustomerHorizontalBar?.series ?? []"
                      :options="optionsCountCustomerHorizontalBar"
                    />
                  </VLoader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VModal
      is="form"
      :open="modalFilter"
      title="Filter"
      size="small"
      actions="right"
      @submit.prevent="onFilter"
      @close="modalFilter = false"
    >
      <template #content>
        <div class="modal-form">
          <VField label="Pilih Area" class="is-autocomplete-select">
            <VControl icon="feather:calendar">
              <Multiselect
                v-model="area_id"
                :options="useAreaGroup"
                :searchable="true"
                placeholder="region"
                @select="onSelect"
              />
            </VControl>
          </VField>
        </div>
      </template>
      <template #action>
        <VButton
          color="primary"
          :loading="isLoading"
          type="submit"
        >
          Search
        </VButton>
      </template>
    </VModal>
    <VModal
      :open="modalZona"
      :title="`${area_name} [ZONA ${zona}]`"
      size="big"
      actions="center"
      @close="modalZona = false"
    >
      <template #content>
        <div class="datatable-wrapper">
          <div class="table-container">
            <table class="table datatable-table is-fullwidth">
              <thead>
                <th>Terminal ID</th>

                <th>Branch</th>
                <th>Area</th>
              </thead>
              <tbody>
                <tr
                  v-for="machine in machineData"
                  :key="machine.id"
                >
                  <td>
                    <div class="flex-media">
                      <div class="meta">
                        <h3>{{ machine.terminal_id }}</h3>
                        <span>{{ machine.sn }}/{{ machine.customers.name }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ machine.branch }}</td>
                  <td>{{ machine.area_groups.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <VPlaceholderPage
            v-if="machineData?.length === 0"
            title="We couldn't find any matching results."
            subtitle="Too bad. Looks like we couldn't find any matching results for the search terms
            you've entered. Please try different search terms or criteria."
            larger
          >
            <template #image>
              <img
                class="light-image"
                src="/@src/assets/illustrations/placeholders/search-7.svg"
                alt=""
              >
              <img
                class="dark-image"
                src="/@src/assets/illustrations/placeholders/search-7-dark.svg"
                alt=""
              >
            </template>
          </VPlaceholderPage>
        </div>

        <!--Table Pagination-->
        <VFlexPagination
          v-if="machineData?.length!! > 0"
          v-model:current-page="currentPage"
          :item-per-page="10"
          :total-items="totalMachine"
          :max-links-displayed="5"
          class="mt-4"
          @update:current-page="getMachineByZona(area_id,zona)"
        />
      </template>
      <template #action />
    </VModal>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v3 {
  .columns {
    &.is-flex-tablet-p {
      .column {
        &.is-6 {
          min-width: 50%;
        }
      }
    }
  }

  .dashboard-card {
    @include vuero-l-card;

    font-family: var(--font);

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    &.is-welcome {
      background: var(--widget-grey);
      border: none;
      padding: 40px;

      .welcome-title {
        h3 {
          font-family: var(--font-alt);
          font-weight: 700;
          font-size: 2rem;
          color: var(--dark-text);
        }
      }

      .welcome-progress {
        display: flex;
        align-items: center;
        padding: 10px 0;

        .meta {
          margin-inline-start: 16px;

          span {
            display: block;

            &:first-child {
              color: var(--light-text);
              font-size: 0.95rem;
            }

            &:nth-child(2) {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              color: var(--dark-text);
            }
          }
        }
      }

      .button-wrap {
        .v-button {
          height: 44px;
          border-radius: 10px;
        }
      }
    }

    &.is-interview {
      &:not(:last-child) {
        margin-bottom: 0.75rem;
      }

      .flex-end {
        svg {
          height: 18px;
          width: 18px;
          color: var(--light-text);
        }
      }
    }
  }

  .picker-widget {
    padding: 40px;
    height: 317px;
  }

  .stats-wrapper {
    display: flex;
    flex-direction: column;
    height: 280px;

    .people {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;

      .left {
        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
          }

          &:nth-child(2) {
            font-size: 0.9rem;
            color: var(--light-text);

            a {
              font-weight: 500;
              color: var(--primary);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .personal-dashboard-v3 {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

.picker-widget {
  @include vuero-l-card;

  &.is-straight {
    @include vuero-s-card;
  }

  .calendar {
    color: var(--dark-text);
    font-size: 12px;
    font-family: var(--font);
    width: 100%;
    margin-bottom: 5px;

    thead,
    tbody {
      width: 100%;
    }
  }

  .calendar thead,
  .calendar th {
    color: var(--primary);
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    text-align: center;
  }

  .calendar td {
    padding: 0.5em 0;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
  }

  .calendar tbody td:hover {
    background: var(--fade-grey-light-3);
    color: var(--primary);
  }

  .current-day {
    color: var(--primary);
    font-weight: 600;
  }

  .prev-month,
  .next-month {
    color: #cacaca;
  }
}

.is-dark {
  .picker-widget {
    @include vuero-card--dark;

    .calendar {
      color: var(--dark-dark-text);

      thead,
      th {
        color: var(--primary);
      }

      td:hover {
        background: var(--dark-sidebar-light-3);
        color: var(--primary);
      }
    }

    .current-day {
      color: var(--primary);
    }
  }
}

@media only screen and (width <= 767px) {
  .personal-dashboard-v3 {
    .stats-wrapper {
      height: auto;
    }
  }
}

.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}

.datatable-wrapper {
  width: 100%;

  .datatable-container {
    background: var(--white);
    border: none !important;
    overflow-x: auto;

    .table,
    table {
      width: 100%;
    }

    &::-webkit-scrollbar {
      height: 8px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(0 0 0 / 20%) !important;
    }
  }
}

.datatable-table {
  border: 1px solid var(--fade-grey);
  border-collapse: collapse;
  border-radius: 0.75rem;

  th {
    padding: 16px 20px;
    font-family: var(--font-alt);
    font-size: 0.8rem;
    color: var(--dark-text);
    text-transform: uppercase;
    border: 1px solid var(--fade-grey);
    font-weight: 600;

    &:last-child {
      text-align: right;
    }
  }

  td {
    font-family: var(--font);
    vertical-align: middle;
    padding: 12px 20px;
    border-bottom: 1px solid var(--fade-grey);

    &:last-child {
      text-align: right;
    }

    &.datatables-empty {
      opacity: 0;
    }
  }

  .light-text {
    color: var(--light-text);
  }

  .flex-media {
    display: flex;
    align-items: center;

    .meta {
      margin-left: 10px;
      line-height: 1.3;

      span {
        display: block;
        font-size: 0.8rem;
        color: var(--light-text);
        font-family: var(--font);

        &:first-child {
          font-family: var(--font-alt);
          color: var(--dark-text);
        }
      }
    }
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
  }

  .checkbox {
    padding: 0;
  }

  .product-photo {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .file-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }

  .drinks-icon {
    display: block;
    max-width: 48px;
    border-radius: var(--radius-rounded);
    border: 1px solid var(--fade-grey);
  }

  .negative-icon,
  .positive-icon {
    svg {
      height: 16px;
      width: 16px;
    }
  }

  .positive-icon {
    .iconify {
      color: var(--success);

      * {
        stroke-width: 4px;
      }
    }
  }

  .negative-icon {
    &.is-danger {
      .iconify {
        color: var(--danger) !important;
      }
    }

    .iconify {
      color: var(--light-text);

      * {
        stroke-width: 4px;
      }
    }
  }

  .price {
    color: var(--dark-text);
    font-weight: 500;

    &::before {
      content: '$';
    }

    &.price-free {
      color: var(--light-text);
    }
  }

  .status {
    display: flex;
    align-items: center;

    &.is-available {
      i {
        color: var(--success);
      }
    }

    &.is-busy {
      i {
        color: var(--danger);
      }
    }

    &.is-offline {
      i {
        color: var(--light-text);
      }
    }

    i {
      margin-right: 8px;
      font-size: 8px;
    }

    span {
      font-family: var(--font);
      font-size: 0.9rem;
      color: var(--light-text);
    }
  }
}

.is-dark {
  .datatable-wrapper {
    .datatable-container {
      border-color: var(--dark-sidebar-light-12);
      background: var(--dark-sidebar-light-6);
    }
  }

  .datatable-table {
    border-color: var(--dark-sidebar-light-12);

    th,
    td {
      border-color: var(--dark-sidebar-light-12);
      color: var(--dark-dark-text);
    }

    .drinks-icon {
      border-color: var(--dark-sidebar-light-12);
    }
  }
}
</style>
