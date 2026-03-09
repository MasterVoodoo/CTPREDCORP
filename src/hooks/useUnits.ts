import { useState, useEffect } from 'react';
import { unitsService } from '@/lib/api';
import type { Unit, SearchFilters } from '@/types';

export const useUnits = (filters?: SearchFilters) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      
      const response = await unitsService.getAll(filters);
      
      if (response.success && response.data) {
        setUnits(response.data);
      } else {
        setError(response.error || 'Failed to fetch units');
      }
      
      setLoading(false);
    };

    fetchUnits();
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    const response = await unitsService.getAll(filters);
    
    if (response.success && response.data) {
      setUnits(response.data);
    } else {
      setError(response.error || 'Failed to fetch units');
    }
    
    setLoading(false);
  };

  return { units, loading, error, refetch };
};

export const useUnit = (id: string) => {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      const response = await unitsService.getById(id);
      
      if (response.success && response.data) {
        setUnit(response.data);
      } else {
        setError(response.error || 'Failed to fetch unit');
      }
      
      setLoading(false);
    };

    fetchUnit();
  }, [id]);

  return { unit, loading, error };
};

export const useBuildingUnits = (buildingId: string) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!buildingId) return;
      
      setLoading(true);
      setError(null);
      
      const response = await unitsService.getByBuilding(buildingId);
      
      if (response.success && response.data) {
        setUnits(response.data);
      } else {
        setError(response.error || 'Failed to fetch units');
      }
      
      setLoading(false);
    };

    fetchUnits();
  }, [buildingId]);

  return { units, loading, error };
};
