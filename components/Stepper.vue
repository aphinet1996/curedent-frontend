<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

// Types
interface StepItem {
    id: string | number
    title: string
    description?: string
    icon: string
}

interface Props {
    steps: StepItem[]
    currentStep?: number
    allowNavigation?: boolean
    theme?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
    showTitles?: boolean
    showDescription?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    currentStep: 1,
    allowNavigation: true,
    theme: 'blue',
    showTitles: true,
    showDescription: false,
    size: 'md'
})

const emit = defineEmits<{
    'step-click': [stepNumber: number, step: StepItem]
}>()

// Size configurations
const sizeConfig = computed(() => {
    const sizes = {
        sm: {
            circle: 'w-8 h-8',
            circleResponsive: 'lg:w-9 lg:h-9',
            icon: 'w-3 h-3',
            iconResponsive: 'lg:w-3.5 lg:h-3.5',
            title: 'text-xs',
            description: 'text-xs',
            lineHeight: 'after:h-0.5',
            lineBorder: 'after:border-2'
        },
        md: {
            circle: 'w-10 h-10',
            circleResponsive: 'lg:w-12 lg:h-12',
            icon: 'w-4 h-4',
            iconResponsive: 'lg:w-5 lg:h-5',
            title: 'text-sm',
            description: 'text-xs',
            lineHeight: 'after:h-0.5',
            lineBorder: 'after:border-1'
        },
        lg: {
            circle: 'w-12 h-12',
            circleResponsive: 'lg:w-14 lg:h-14',
            icon: 'w-5 h-5',
            iconResponsive: 'lg:w-6 lg:h-6',
            title: 'text-base',
            description: 'text-sm',
            lineHeight: 'after:h-1',
            lineBorder: 'after:border-4'
        }
    }
    return sizes[props.size]
})

// Theme configurations (เหมือนกับ FormAddAssistant)
const themeConfig = computed(() => {
    const themes = {
        blue: {
            completed: {
                bg: 'bg-green-500',
                text: 'text-white',
                border: 'border-green-500',
                line: 'after:border-green-200',
                titleColor: 'text-green-600'
            },
            active: {
                bg: 'bg-blue-500',
                text: 'text-white',
                border: 'border-blue-500',
                line: 'after:border-blue-200',
                titleColor: 'text-blue-600'
            },
            pending: {
                bg: 'bg-gray-100',
                text: 'text-gray-500',
                border: 'border-gray-300',
                line: 'after:border-gray-200',
                titleColor: 'text-gray-500'
            }
        },
        green: {
            completed: {
                bg: 'bg-emerald-500',
                text: 'text-white',
                border: 'border-emerald-500',
                line: 'after:border-emerald-200',
                titleColor: 'text-emerald-600'
            },
            active: {
                bg: 'bg-green-500',
                text: 'text-white',
                border: 'border-green-500',
                line: 'after:border-green-200',
                titleColor: 'text-green-600'
            },
            pending: {
                bg: 'bg-gray-100',
                text: 'text-gray-500',
                border: 'border-gray-300',
                line: 'after:border-gray-200',
                titleColor: 'text-gray-500'
            }
        },
        purple: {
            completed: {
                bg: 'bg-emerald-500',
                text: 'text-white',
                border: 'border-emerald-500',
                line: 'after:border-emerald-200',
                titleColor: 'text-emerald-600'
            },
            active: {
                bg: 'bg-purple-500',
                text: 'text-white',
                border: 'border-purple-500',
                line: 'after:border-purple-200',
                titleColor: 'text-purple-600'
            },
            pending: {
                bg: 'bg-gray-100',
                text: 'text-gray-500',
                border: 'border-gray-300',
                line: 'after:border-gray-200',
                titleColor: 'text-gray-500'
            }
        },
        orange: {
            completed: {
                bg: 'bg-emerald-500',
                text: 'text-white',
                border: 'border-emerald-500',
                line: 'after:border-emerald-200',
                titleColor: 'text-emerald-600'
            },
            active: {
                bg: 'bg-orange-500',
                text: 'text-white',
                border: 'border-orange-500',
                line: 'after:border-orange-200',
                titleColor: 'text-orange-600'
            },
            pending: {
                bg: 'bg-gray-100 ',
                text: 'text-gray-500',
                border: 'border-gray-300',
                line: 'after:border-gray-200',
                titleColor: 'text-gray-500'
            }
        },
        red: {
            completed: {
                bg: 'bg-emerald-500',
                text: 'text-white',
                border: 'border-emerald-500',
                line: 'after:border-emerald-200',
                titleColor: 'text-emerald-600'
            },
            active: {
                bg: 'bg-red-500 dark:bg-red-600',
                text: 'text-white',
                border: 'border-red-500',
                line: 'after:border-red-200',
                titleColor: 'text-red-600'
            },
            pending: {
                bg: 'bg-gray-100 ',
                text: 'text-gray-500',
                border: 'border-gray-300',
                line: 'after:border-gray-200',
                titleColor: 'text-gray-500'
            }
        }
    }
    return themes[props.theme]
})

const getStepStatus = (stepIndex: number) => {
    const stepNumber = stepIndex + 1
    if (stepNumber < props.currentStep) return 'completed'
    if (stepNumber === props.currentStep) return 'active'
    return 'pending'
}

// Get step styles
const getStepStyles = (stepIndex: number) => {
    const status = getStepStatus(stepIndex)
    return themeConfig.value[status]
}

// Check if step is clickable
const isStepClickable = (stepIndex: number) => {
    if (!props.allowNavigation) return false
    const stepNumber = stepIndex + 1
    return stepNumber <= props.currentStep
}

// Handle step click
const handleStepClick = (stepIndex: number) => {
    const stepNumber = stepIndex + 1
    const step = props.steps[stepIndex]

    if (isStepClickable(stepIndex)) {
        emit('step-click', stepNumber, step)
    }
}

// Check if should show connecting line
const shouldShowLine = (stepIndex: number) => {
    return stepIndex < props.steps.length - 1
}
</script>

<template>
    <div class="mb-8">
        <ol class="flex items-center w-full">
            <li v-for="(step, index) in steps" :key="step.id" class="flex items-center transition-all duration-300"
                :class="[
                    shouldShowLine(index) ? 'w-full' : '',
                    shouldShowLine(index) ? `${getStepStyles(index).line} after:content-[''] after:w-full after:border-b ${sizeConfig.lineHeight} ${sizeConfig.lineBorder} after:inline-block after:transition-all after:duration-300` : '',
                    isStepClickable(index) ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
                ]" @click="handleStepClick(index)">
                <div class="flex flex-col items-center">
                    <span
                        class="flex items-center justify-center rounded-full shrink-0 border-2 transition-all duration-300"
                        :class="[
                            sizeConfig.circle,
                            sizeConfig.circleResponsive,
                            getStepStyles(index).bg,
                            getStepStyles(index).text,
                            getStepStyles(index).border,
                            isStepClickable(index) ? 'hover:scale-110' : ''
                        ]">
                        <Icon v-if="getStepStatus(index) === 'completed'" icon="heroicons:check-20-solid"
                            :class="[sizeConfig.icon, sizeConfig.iconResponsive]" />
                        <Icon v-else :icon="step.icon" :class="[sizeConfig.icon, sizeConfig.iconResponsive]" />
                    </span>

                    <div v-if="showTitles" class="mt-3 text-center max-w-[120px] transition-all duration-300"
                        :class="isStepClickable(index) ? 'group-hover:-translate-y-0.5' : ''">
                        <p :class="[
                            sizeConfig.title,
                            'font-medium transition-colors duration-200 leading-tight',
                            getStepStyles(index).titleColor
                        ]">
                            {{ step.title }}
                        </p>

                        <p v-if="showDescription && step.description" :class="[
                            sizeConfig.description,
                            'text-gray-500 mt-1 leading-tight'
                        ]">
                            {{ step.description }}
                        </p>
                    </div>
                </div>
            </li>
        </ol>
    </div>
</template>

<style scoped>
/* Smooth transitions for all elements */
/** {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}*/

/* Enhanced hover effects */
/*.cursor-pointer:hover {
  transform: translateY(-2px);
}*/

/* Focus states for accessibility */
/*.cursor-pointer:focus {
  outline: 2px solid rgb(59 130 246 / 0.5);
  outline-offset: 2px;
  border-radius: 0.5rem;
}*/
</style>