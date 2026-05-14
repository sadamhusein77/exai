// Settings Modal Component
// Modal for configuring OpenRouter API key (supports free models)

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export function SettingsModal({ isOpen, onClose, apiKey, onSaveApiKey }: SettingsModalProps) {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputKey(apiKey);
      setSaved(false);
    }
  }, [isOpen, apiKey]);

  const handleSave = async () => {
    setIsSaving(true);
    onSaveApiKey(inputKey.trim());
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasKey = inputKey.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* API Key Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-slate-500" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                OpenRouter API Key
              </label>
            </div>

            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-or-..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get free API key from{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenRouter
              </a>
            </p>
          </div>

          {/* Status */}
          {saved && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm">Settings saved successfully!</span>
            </div>
          )}

          {!apiKey && !saved && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle size={16} />
              <span className="text-sm">API key is required to generate promotions</span>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              OpenRouter provides access to free AI models like meta-llama/llama-3-8b-instruct.
              Your API key is stored locally in your browser.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!hasKey} isLoading={isSaving}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}