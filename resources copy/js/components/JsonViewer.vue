<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

interface Props {
    value?: string | Record<string, unknown> | null;
    maxHeight?: string;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    maxHeight: '400px',
});

const containerRef = ref<HTMLDivElement | null>(null);

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

const jsonString = computed(() => {
    if (!props.value) return '';
    if (typeof props.value === 'string') {
        // Try to parse and reformat if it's valid JSON/JS object literal
        try {
            const parsed = JSON.parse(props.value);
            return JSON.stringify(parsed, null, 2);
        } catch {
            // If it's a JS object literal, try to evaluate it
            try {
                const evaluated = new Function('return ' + props.value)();
                return JSON.stringify(evaluated, null, 2);
            } catch {
                // If all fails, return as-is
                return props.value;
            }
        }
    }
    return JSON.stringify(props.value, null, 2);
});

const lineCount = computed(() => {
    if (!jsonString.value) return 1;
    return Math.max(1, jsonString.value.split('\n').length);
});

const lines = computed(() => {
    return Array.from({ length: lineCount.value }, (_, i) => i + 1);
});

const updateContent = () => {
    if (!containerRef.value) return;
    
    const text = jsonString.value || '';
    if (!text.trim()) {
        containerRef.value.innerHTML = '<div style="line-height: 1.5rem; min-height: 1.5rem; color: rgb(156, 163, 175);">&nbsp;</div>';
        return;
    }
    
    const lines = text.split('\n');
    containerRef.value.innerHTML = '';
    
    // Create a wrapper div to hold all lines
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    
    lines.forEach((line) => {
        const div = document.createElement('div');
        div.style.lineHeight = '1.5rem';
        div.style.minHeight = '1.5rem';
        div.style.whiteSpace = 'pre';
        div.style.color = 'rgb(17, 24, 39)';
        div.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
        div.style.fontSize = '0.875rem';
        
        const highlighted = highlightJson(line);
        div.innerHTML = highlighted;
        
        wrapper.appendChild(div);
    });
    
    containerRef.value.appendChild(wrapper);
};

watch(jsonString, () => {
    nextTick(() => {
        updateContent();
    });
}, { immediate: true });

onMounted(() => {
    nextTick(() => {
        updateContent();
    });
});
</script>

<template>
    <div :class="['relative w-full rounded-md border border-input bg-background overflow-hidden', props.class]">
        <!-- Line Numbers -->
        <div
            class="absolute left-0 top-0 w-12 bg-muted/30 border-r border-input px-2 py-3 text-right text-xs text-muted-foreground font-mono select-none overflow-hidden z-30"
            style="line-height: 1.5rem;"
        >
            <div v-for="line in lines" :key="line" style="line-height: 1.5rem; min-height: 1.5rem;">
                {{ line }}
            </div>
        </div>

        <!-- Syntax Highlight Content -->
        <div
            ref="containerRef"
            class="px-3 py-2 pl-14 text-sm font-mono overflow-auto"
            :style="{ 
                maxHeight: props.maxHeight, 
                lineHeight: '1.5rem'
            }"
        />
    </div>
</template>
