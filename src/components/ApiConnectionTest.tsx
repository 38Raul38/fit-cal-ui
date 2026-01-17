/**
 * API CONNECTION TEST
 * 
 * Этот компонент можно использовать для тестирования подключения к API
 * Импортируйте его в любую страницу для проверки
 */

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function ApiConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing connection...');
    setDetails(null);

    try {
      // Простой тест - попытка получить данные
      const response = await api.get('/health'); // или любой ваш endpoint
      
      setStatus('success');
      setMessage('✅ Connection successful!');
      setDetails(response.data);
    } catch (error: any) {
      setStatus('error');
      
      if (error.response) {
        // Сервер ответил с ошибкой
        setMessage(`❌ Server error: ${error.response.status}`);
        setDetails({
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        // Запрос отправлен, но ответа нет
        setMessage('❌ Network error: No response from server');
        setDetails({
          message: 'Check if backend is running',
          url: api.defaults.baseURL
        });
      } else {
        // Ошибка при настройке запроса
        setMessage(`❌ Error: ${error.message}`);
        setDetails(error);
      }
    }
  };

  const testRegister = async () => {
    setStatus('loading');
    setMessage('Testing register endpoint...');
    setDetails(null);

    try {
      const response = await api.post('/Auth/register', {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123456'
      });

      setStatus('success');
      setMessage('✅ Register endpoint works!');
      setDetails(response.data);
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Register failed: ${error.message}`);
      setDetails(error.response?.data || error);
    }
  };

  const testLogin = async () => {
    setStatus('loading');
    setMessage('Testing login endpoint...');
    setDetails(null);

    try {
      const response = await api.post('/Auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });

      setStatus('success');
      setMessage('✅ Login endpoint works!');
      setDetails(response.data);
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Login failed: ${error.message}`);
      setDetails(error.response?.data || error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'loading': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm font-mono">
            API URL: <span className="text-primary">{api.defaults.baseURL}</span>
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={testConnection} disabled={status === 'loading'}>
            Test Connection
          </Button>
          <Button onClick={testRegister} disabled={status === 'loading'} variant="outline">
            Test Register
          </Button>
          <Button onClick={testLogin} disabled={status === 'loading'} variant="outline">
            Test Login
          </Button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border ${
            status === 'success' ? 'bg-green-50 border-green-200' :
            status === 'error' ? 'bg-red-50 border-red-200' :
            status === 'loading' ? 'bg-yellow-50 border-yellow-200' :
            'bg-muted border-border'
          }`}>
            <p className={`font-medium ${getStatusColor()}`}>{message}</p>
          </div>
        )}

        {details && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Response Details:</p>
            <pre className="text-xs overflow-auto max-h-96 bg-background p-3 rounded">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Make sure your ASP.NET backend is running</li>
            <li>Check CORS is configured correctly</li>
            <li>Verify the API URL in .env file</li>
            <li>Open DevTools → Network to see requests</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Использование:
// import { ApiConnectionTest } from '@/components/ApiConnectionTest';
// <ApiConnectionTest />
