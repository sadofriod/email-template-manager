import { useEffect, useCallback, useRef } from "react";
import type { TemplateData } from "@/types";
import { storage } from "@/utils";

const DRAFT_KEY_PREFIX = "template_draft_";
const DRAFT_METADATA_KEY = "template_draft_metadata";

interface DraftMetadata {
  templateId?: string;
  timestamp: number;
  isNewTemplate: boolean;
}

/**
 * 模板草稿管理 Hook
 * 用于自动保存和恢复正在编辑的模板草稿
 */
export const useTemplateDraft = (templateId?: string) => {
  const draftKey = templateId
    ? `${DRAFT_KEY_PREFIX}${templateId}`
    : `${DRAFT_KEY_PREFIX}new`;

  // 使用 ref 来存储定时器，避免在依赖数组中引起重新渲染
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 保存草稿到 localStorage
   */
  const saveDraft = useCallback(
    (data: Partial<TemplateData>) => {
      try {
        const metadata: DraftMetadata = {
          templateId: templateId,
          timestamp: Date.now(),
          isNewTemplate: !templateId,
        };

        // 保存草稿数据
        storage.setObject(draftKey, data);
        // 保存草稿元数据
        storage.setObject(DRAFT_METADATA_KEY, metadata);

        console.log("草稿已保存:", draftKey);
      } catch (error) {
        console.error("保存草稿失败:", error);
      }
    },
    [draftKey, templateId],
  );

  /**
   * 自动保存草稿（防抖）
   */
  const autoSaveDraft = useCallback(
    (data: Partial<TemplateData>, delay = 1000) => {
      // 清除之前的定时器
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // 设置新的定时器
      saveTimerRef.current = setTimeout(() => {
        saveDraft(data);
      }, delay);
    },
    [saveDraft],
  );

  /**
   * 加载草稿
   */
  const loadDraft = useCallback((): Partial<TemplateData> | null => {
    try {
      const draft = storage.getObject<Partial<TemplateData>>(draftKey);
      return draft;
    } catch (error) {
      console.error("加载草稿失败:", error);
      return null;
    }
  }, [draftKey]);

  /**
   * 清除草稿
   */
  const clearDraft = useCallback(() => {
    try {
      storage.remove(draftKey);
      storage.remove(DRAFT_METADATA_KEY);
      console.log("草稿已清除:", draftKey);
    } catch (error) {
      console.error("清除草稿失败:", error);
    }
  }, [draftKey]);

  /**
   * 检查是否有草稿
   */
  const hasDraft = useCallback((): boolean => {
    const draft = loadDraft();
    return draft !== null && Object.keys(draft).length > 0;
  }, [loadDraft]);

  /**
   * 获取草稿元数据
   */
  const getDraftMetadata = useCallback((): DraftMetadata | null => {
    try {
      return storage.getObject<DraftMetadata>(DRAFT_METADATA_KEY);
    } catch (error) {
      console.error("获取草稿元数据失败:", error);
      return null;
    }
  }, []);

  /**
   * 清理定时器
   */
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    saveDraft,
    autoSaveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    getDraftMetadata,
  };
};
