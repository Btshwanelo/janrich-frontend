import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/untitled-card';
import { PROFILE_MESSAGES } from '@/constants/profile';

interface ProfileErrorStateProps {
  onRetry?: () => void;
  error?: string;
}

export const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ onRetry,error }) => {
  return (
<div className="flex-1 p-4 lg:p-8">
      <Card className=" mx-auto border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {PROFILE_MESSAGES.ERROR}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-6">
            {error}
          </p>
          {onRetry && (
            <Button
              color="primary"
              size="md"
              className="gap-2"
              iconLeading={<RefreshCw className="w-4 h-4" />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
