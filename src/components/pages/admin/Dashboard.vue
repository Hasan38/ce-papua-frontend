<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { CountZona, CountCustomer, CountCustomerType } from '/@src/models/dashboard'
import { useThemeColors } from '/@src/composable/useThemeColors'
import { useAreaGroup } from '/@src/services/get-areaGroup'
import { type OptionsCountCustomerPie } from '/@src/models/chartPie'
import { type OptionsCountCustomerBar } from '/@src/models/chartBar'
import sleep from '/@src/utils/sleep'
const themeColors = useThemeColors()
const $fetch = useLaravelFetch()
interface Response {
  success: boolean
  data: {
    count_customer: CountCustomer[]
    count_zona: CountZona
    count_customer_type: CountCustomerType[]
  }
}
const area_id = ref(1)
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

function getData() {
  if (!isLoading.value) {
    isLoading.value = true
    watchEffect(async () => {
      sleep(500)
      await $fetch<Response>(`/api/dashboard?area_id=${area_id.value}`).then(((res) => {
        isLoading.value = false
        count_zonas.value = res.data.count_zona
        const count_customer = res.data.count_customer?.map(function (item) {
          return {
            x: item.name,
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
      })).catch(((e) => {
        console.log(e)
      }))
    })
  }
}

</script>

<template>
  <div class="personal-dashboard personal-dashboard-v3">
    <div class="columns">
      <div class="column is-12">
        <div class="stats-wrapper">
          <div class="columns is-multiline is-flex-tablet-p">
            <div class="column is-3">
              <div class="dashboard-card">
                <VField>
                  <VControl>
                    <Multiselect
                      v-model="area_id"
                      :options="useAreaGroup"
                      placeholder="pilih area group"
                      @input="getData"
                    />
                  </VControl>
                </VField>
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
                <VBlock
                  v-else
                  :title="`${count_zonas?.zona_1} Mesin`"
                  subtitle="ZONA 1"
                  center
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
                <VBlock
                  v-else
                  :title="`${count_zonas?.zona_2} Mesin`"
                  subtitle="ZONA 2"
                  center
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
                <VBlock
                  v-else
                  :title="`${count_zonas?.zona_3} Mesin`"
                  subtitle="ZONA 3"
                  center
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
</style>
