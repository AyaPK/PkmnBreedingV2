import { useState, useRef, useEffect, useId, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

interface Props {
  id: string
  label: string
  value: string
  pokemonNames: string[]
  loading: boolean
  error: string | null
  onCommit: (name: string) => void
}

const MAX_SUGGESTIONS = 8

export default function PokemonCombobox({
  id,
  label,
  value,
  pokemonNames,
  loading,
  error,
  onCommit,
}: Props) {
  const listboxId = useId()
  const [inputVal, setInputVal] = useState(value)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = inputVal.length < 2
    ? []
    : pokemonNames
        .filter(n => n.startsWith(inputVal.toLowerCase()))
        .slice(0, MAX_SUGGESTIONS)

  useEffect(() => {
    setInputVal(value)
  }, [value])

  useEffect(() => {
    setActiveIdx(-1)
  }, [suggestions.length])

  const commit = useCallback((name: string) => {
    setInputVal(name)
    setOpen(false)
    setActiveIdx(-1)
    onCommit(name)
  }, [onCommit])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter') { onCommit(inputVal); setOpen(false) }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(activeIdx + 1, suggestions.length - 1)
      setActiveIdx(next)
      scrollOptionIntoView(next)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(activeIdx - 1, -1)
      setActiveIdx(prev)
      if (prev >= 0) scrollOptionIntoView(prev)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0) {
        commit(suggestions[activeIdx])
      } else {
        commit(inputVal)
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  const scrollOptionIntoView = (idx: number) => {
    const list = listRef.current
    if (!list) return
    const item = list.children[idx] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeOptionId = activeIdx >= 0 ? `${listboxId}-opt-${activeIdx}` : undefined

  return (
    <div ref={containerRef} className="flex flex-col gap-1 relative">
      <label htmlFor={id} className="text-white/70 text-xs">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-label={label}
          className="w-full rounded-lg px-3 py-1.5 text-white placeholder:text-white/40 text-sm outline-none pr-8"
          style={{ background: '#0d2a3a', border: '1px solid rgba(42,184,200,0.35)' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(42,184,200,0.8)'; if (suggestions.length > 0) setOpen(true) }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(42,184,200,0.35)'; setTimeout(() => setOpen(false), 150) }}
          placeholder="e.g. pikachu"
          autoComplete="off"
          spellCheck={false}
          value={inputVal}
          onChange={e => {
            const v = e.target.value
            setInputVal(v)
            setOpen(true)
            setActiveIdx(-1)
          }}
          onKeyDown={handleKeyDown}
        />
        {loading && (
          <Loader2
            className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin" style={{ color: '#2ab8c8' }}
            size={14}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Suggestion dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={`Pokémon suggestions for ${label}`}
          className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg shadow-xl overflow-y-auto max-h-48" style={{ background: '#071a26', border: '1px solid rgba(42,184,200,0.35)' }}
        >
          {suggestions.map((name, idx) => (
            <li
              key={name}
              id={`${listboxId}-opt-${idx}`}
              role="option"
              aria-selected={idx === activeIdx}
              className="px-3 py-2 text-sm cursor-pointer capitalize transition-colors"
              style={idx === activeIdx
                ? { background: 'rgba(232,200,74,0.2)', color: '#e8c84a' }
                : { color: 'rgba(255,255,255,0.8)' }
              }
              onMouseDown={() => commit(name)}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-300 text-xs mt-0.5" role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
