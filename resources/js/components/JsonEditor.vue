<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    modelValue?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    id?: string;
    name?: string;
    'aria-invalid'?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lineNumbersRef = ref<HTMLDivElement | null>(null);
const highlightRef = ref<HTMLDivElement | null>(null);

const value = computed({
    get: () => props.modelValue ?? props.defaultValue ?? '',
    set: (val) => emit('update:modelValue', val),
});

const lineCount = computed(() => {
    if (!value.value) return 1;
    return Math.max(1, value.value.split('\n').length);
});

const lines = computed(() => {
    return Array.from({ length: lineCount.value }, (_, i) => i + 1);
});

const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

const highlightJson = (text: string): string => {
    if (!text.trim()) {
        return '<span style="color: rgb(156, 163, 175);">&nbsp;</span>';
    }
    
    // Tokenize the text - find all matches with their positions
    interface Token {
        start: number;
        end: number;
        type: 'string' | 'key' | 'keyword' | 'number' | 'punctuation' | 'text';
        value: string;
        isKey?: boolean;
    }
    
    const tokens: Token[] = [];
    let i = 0;
    
    // Step 1: Find strings first (they have highest priority)
    const stringRegex = /("(?:[^"\\]|\\.)*")/g;
    let match;
    while ((match = stringRegex.exec(text)) !== null) {
        const remainingText = text.substring(match.index + match[0].length);
        const isKey = /^\s*:/.test(remainingText);
        tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: 'string',
            value: match[0],
            isKey,
        });
    }
    
    // Step 2: Find JavaScript keys (without quotes, followed by colon)
    const keyRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
    while ((match = keyRegex.exec(text)) !== null) {
        // Check if this key is inside a string
        const isInsideString = tokens.some(t => t.type === 'string' && match.index >= t.start && match.index < t.end);
        if (!isInsideString) {
            tokens.push({
                start: match.index,
                end: match.index + match[1].length,
                type: 'key',
                value: match[1],
            });
            // Also add the colon
            tokens.push({
                start: match.index + match[1].length,
                end: match.index + match[0].length,
                type: 'punctuation',
                value: ':',
            });
        }
    }
    
    // Step 3: Find keywords
    const keywordRegex = /\b(true|false|null)\b/g;
    while ((match = keywordRegex.exec(text)) !== null) {
        const isInsideString = tokens.some(t => t.type === 'string' && match.index >= t.start && match.index < t.end);
        if (!isInsideString) {
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                type: 'keyword',
                value: match[0],
            });
        }
    }
    
    // Step 4: Find numbers
    const numberRegex = /(-?\d+\.?\d*(?:[eE][+\-]?\d+)?)/g;
    while ((match = numberRegex.exec(text)) !== null) {
        const isInsideString = tokens.some(t => t.type === 'string' && match.index >= t.start && match.index < t.end);
        if (!isInsideString) {
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                type: 'number',
                value: match[0],
            });
        }
    }
    
    // Step 5: Find punctuation (brackets, braces, commas)
    const punctRegex = /([{}[\],])/g;
    while ((match = punctRegex.exec(text)) !== null) {
        const isInsideString = tokens.some(t => t.type === 'string' && match.index >= t.start && match.index < t.end);
        if (!isInsideString) {
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                type: 'punctuation',
                value: match[0],
            });
        }
    }
    
    // Sort tokens by start position
    tokens.sort((a, b) => a.start - b.start);
    
    // Build HTML by iterating through text and inserting spans
    let result = '';
    let lastIndex = 0;
    
    tokens.forEach((token) => {
        // Add text before token
        if (token.start > lastIndex) {
            const textBefore = text.substring(lastIndex, token.start);
            result += `<span style="color: rgb(17, 24, 39);">${escapeHtml(textBefore)}</span>`;
        }
        
        // Add token with appropriate color
        let color = 'rgb(17, 24, 39)';
        let fontWeight = '400';
        
        switch (token.type) {
            case 'string':
                color = token.isKey ? 'rgb(147, 51, 234)' : 'rgb(34, 197, 94)';
                fontWeight = token.isKey ? '600' : '400';
                break;
            case 'key':
                color = 'rgb(147, 51, 234)';
                fontWeight = '600';
                break;
            case 'keyword':
                color = 'rgb(249, 115, 22)';
                fontWeight = '500';
                break;
            case 'number':
                color = 'rgb(37, 99, 235)';
                break;
            case 'punctuation':
                color = 'rgb(107, 114, 128)';
                fontWeight = '600';
                break;
        }
        
        result += `<span style="color: ${color}; font-weight: ${fontWeight};">${escapeHtml(token.value)}</span>`;
        lastIndex = token.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
        const textAfter = text.substring(lastIndex);
        result += `<span style="color: rgb(17, 24, 39);">${escapeHtml(textAfter)}</span>`;
    }
    
    // If no tokens were found, wrap entire text
    if (tokens.length === 0) {
        result = `<span style="color: rgb(17, 24, 39);">${escapeHtml(text)}</span>`;
    }
    
    return result;
};

const syncScroll = () => {
    if (!textareaRef.value || !lineNumbersRef.value || !highlightRef.value) return;
    
    const scrollTop = textareaRef.value.scrollTop;
    const scrollLeft = textareaRef.value.scrollLeft;
    
    // Sync line numbers
    lineNumbersRef.value.scrollTop = scrollTop;
    
    // Sync highlight overlay - force scroll position
    highlightRef.value.scrollTop = scrollTop;
    highlightRef.value.scrollLeft = scrollLeft;
};

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
    nextTick(() => {
        syncScroll();
        updateHighlight();
    });
};

const updateHighlight = () => {
    if (!highlightRef.value || !textareaRef.value) return;
    
    const lines = value.value.split('\n');
    highlightRef.value.innerHTML = '';
    
    // Create a wrapper div that will have the full scrollHeight
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    
    lines.forEach((line) => {
        const div = document.createElement('div');
        div.style.lineHeight = '1.5rem';
        div.style.minHeight = '1.5rem';
        div.style.whiteSpace = 'pre';
        div.style.color = 'rgb(17, 24, 39)'; // Default color
        
        const highlighted = highlightJson(line);
        div.innerHTML = highlighted;
        
        wrapper.appendChild(div);
    });
    
    highlightRef.value.appendChild(wrapper);
    
    // Sync dimensions - ensure highlight overlay matches textarea exactly
    nextTick(() => {
        if (!textareaRef.value || !highlightRef.value) return;
        
        // Get computed styles from textarea
        const textareaStyle = window.getComputedStyle(textareaRef.value);
        
        // Match all dimensions exactly
        const textareaScrollHeight = textareaRef.value.scrollHeight;
        const textareaClientHeight = textareaRef.value.clientHeight;
        const textareaScrollWidth = textareaRef.value.scrollWidth;
        
        // Calculate padding values
        const textareaPaddingLeft = parseFloat(textareaStyle.paddingLeft);
        const textareaPaddingRight = parseFloat(textareaStyle.paddingRight);
        
        // The textarea has pl-14 (56px) for line numbers + px-3 (12px) = 68px total padding-left
        // The highlight overlay is at left-12 (48px), so it needs px-3 (12px) padding-left
        // Calculate the content width (scrollWidth minus all padding)
        const contentWidth = textareaScrollWidth - textareaPaddingLeft - textareaPaddingRight;
        
        // Set wrapper to have the full scrollHeight and content width
        wrapper.style.height = `${textareaScrollHeight}px`;
        wrapper.style.width = `${contentWidth}px`;
        
        // Set overlay container dimensions
        // Width should match textarea's content area exactly
        // The textarea has pl-14 (56px) total, but highlight is at left-12 (48px)
        // So highlight needs to be: textarea width - 48px (left offset)
        const textareaRect = textareaRef.value.getBoundingClientRect();
        const containerRect = highlightRef.value.parentElement?.getBoundingClientRect();
        const highlightWidth = textareaRect.width - 48; // Subtract left-12 offset
        
        highlightRef.value.style.width = `${highlightWidth}px`;
        highlightRef.value.style.paddingTop = textareaStyle.paddingTop;
        highlightRef.value.style.paddingBottom = textareaStyle.paddingBottom;
        highlightRef.value.style.paddingLeft = '12px'; // px-3, matches textarea's px-3
        highlightRef.value.style.paddingRight = textareaStyle.paddingRight;
        highlightRef.value.style.fontSize = textareaStyle.fontSize;
        highlightRef.value.style.fontFamily = textareaStyle.fontFamily;
        highlightRef.value.style.lineHeight = textareaStyle.lineHeight;
        highlightRef.value.style.boxSizing = textareaStyle.boxSizing;
        highlightRef.value.style.overflowY = 'auto';
        highlightRef.value.style.overflowX = 'hidden'; // Hide horizontal scrollbar
        
        // CRITICAL: Set the visible height to match textarea's clientHeight
        // This ensures both have the same scrollable viewport
        highlightRef.value.style.height = `${textareaClientHeight}px`;
        highlightRef.value.style.maxHeight = `${textareaClientHeight}px`;
        
        // Sync scroll position immediately after dimensions are set
        syncScroll();
    });
};

watch(value, () => {
    updateHighlight();
    nextTick(() => {
        syncScroll();
    });
}, { immediate: true });

onMounted(() => {
    updateHighlight();
    nextTick(() => {
        if (textareaRef.value) {
            textareaRef.value.addEventListener('scroll', syncScroll, { passive: true });
            // Also listen for resize events to update dimensions
            const resizeObserver = new ResizeObserver(() => {
                updateHighlight();
            });
            resizeObserver.observe(textareaRef.value);
        }
    });
});

onUnmounted(() => {
    if (textareaRef.value) {
        textareaRef.value.removeEventListener('scroll', syncScroll);
    }
});
</script>

<template>
    <div :class="cn('relative w-full rounded-md border border-input bg-background overflow-hidden', props.class)">
        <!-- Line Numbers -->
        <div
            ref="lineNumbersRef"
            class="absolute left-0 top-0 w-12 bg-muted/30 border-r border-input px-2 py-3 text-right text-xs text-muted-foreground font-mono select-none overflow-hidden z-30"
            style="line-height: 1.5rem; min-height: 400px;"
        >
            <div v-for="line in lines" :key="line" style="line-height: 1.5rem; min-height: 1.5rem;">
                {{ line }}
            </div>
        </div>

        <!-- Syntax Highlight Overlay - MUST be before textarea for proper layering -->
        <div
            ref="highlightRef"
            class="absolute left-12 top-0 text-sm font-mono pointer-events-none z-20"
            style="white-space: pre; overflow-wrap: normal; overflow-y: auto; overflow-x: hidden;"
        />

        <!-- Textarea -->
        <textarea
            :id="id"
            :name="name"
            ref="textareaRef"
            :value="value"
            @input="handleInput"
            @scroll="syncScroll"
            :placeholder="placeholder"
            :disabled="disabled"
            :aria-invalid="aria-invalid"
            class="relative w-full bg-transparent px-3 py-2 pl-14 text-sm font-mono text-transparent caret-foreground resize-none border-0 outline-none focus:outline-none overflow-auto z-10"
            style="line-height: 1.5rem; white-space: pre; overflow-wrap: normal; tab-size: 2; min-height: 400px;"
            spellcheck="false"
        />
    </div>
</template>
