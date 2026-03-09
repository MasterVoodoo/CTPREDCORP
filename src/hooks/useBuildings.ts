import { useState, useEffect } from 'react';
import { buildingsService } from '@/lib/api';
import type { Building } from '@/types';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      setError(null);
      
      const response = await buildingsService.getAll();
      
      if (response.success && response.data) {
        setBuildings(response.data);
      } else {
        setError(response.error || 'Failed to fetch buildings');
      }
      
      setLoading(false);
    };

    fetchBuildings();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    const response = await buildingsService.getAll();
    
    if (response.success && response.data) {
      setBuildings(response.data);
    } else {
      setError(response.error || 'Failed to fetch buildings');
    }
    
    setLoading(false);
  };

  return { buildings, loading, error, refetch };
};

export const useBuilding = (id: string) => {
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      const response = await buildingsService.getById(id);
      
      if (response.success && response.data) {
        setBuilding(response.data);
      } else {
        setError(response.error || 'Failed to fetch building');
      }
      
      setLoading(false);
    };

    fetchBuilding();
  }, [id]);

  return { building, loading, error };
};
