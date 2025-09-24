/**
 * Basic tests for server actions
 * This verifies that the server actions are properly structured and can be imported
 */

import { describe, it, expect } from 'vitest'
import {
  // Page actions
  createPage,
  updatePage,
  deletePage,
  duplicatePage,
  publishPage,
  unpublishPage,
  
  // Collection actions
  createCollection,
  updateCollection,
  
  // Item actions
  createItem,
  updateItem,
  deleteItem,
  publishItem,
  unpublishItem,
  
  // Global actions
  upsertGlobal,
  getGlobal,
  deleteGlobal,
  getAllGlobals,
  
  // Types
  type ActionResult,
} from '../index'

describe('Server Actions', () => {
  describe('Page Actions', () => {
    it('should export all page actions', () => {
      expect(typeof createPage).toBe('function')
      expect(typeof updatePage).toBe('function')
      expect(typeof deletePage).toBe('function')
      expect(typeof duplicatePage).toBe('function')
      expect(typeof publishPage).toBe('function')
      expect(typeof unpublishPage).toBe('function')
    })
  })

  describe('Collection Actions', () => {
    it('should export all collection actions', () => {
      expect(typeof createCollection).toBe('function')
      expect(typeof updateCollection).toBe('function')
    })
  })

  describe('Item Actions', () => {
    it('should export all item actions', () => {
      expect(typeof createItem).toBe('function')
      expect(typeof updateItem).toBe('function')
      expect(typeof deleteItem).toBe('function')
      expect(typeof publishItem).toBe('function')
      expect(typeof unpublishItem).toBe('function')
    })
  })

  describe('Global Actions', () => {
    it('should export all global actions', () => {
      expect(typeof upsertGlobal).toBe('function')
      expect(typeof getGlobal).toBe('function')
      expect(typeof deleteGlobal).toBe('function')
      expect(typeof getAllGlobals).toBe('function')
    })
  })

  describe('Types', () => {
    it('should export ActionResult type', () => {
      // This is a compile-time check - if the type is properly exported, this will pass
      const result: ActionResult = { ok: true }
      expect(result.ok).toBe(true)
    })
  })
})
