import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEmployees, searchEmployees, deleteEmployee } from '../api/employees';

export default function Employees() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const [filters, setFilters] = useState({ department: '', position: '' });
  const [useSearch, setUseSearch] = useState(false);

  const queryKey = useMemo(
    () =>
      useSearch
        ? ['employees', 'search', filters.department, filters.position]
        : ['employees', 'all'],
    [useSearch, filters]
  );

  const queryFn = () =>
    useSearch
      ? searchEmployees({
          department: filters.department || undefined,
          position: filters.position || undefined
        })
      : getEmployees();

  const { data, isLoading, isFetching, refetch } = useQuery({ queryKey, queryFn });

  useEffect(() => {
    refetch();
  }, [useSearch]);

  const logout = () => {
    localStorage.removeItem('token');
    nav('/');
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await deleteEmployee(id);
    qc.invalidateQueries({ queryKey: ['employees'] });
    qc.invalidateQueries({
      queryKey: ['employees', 'search', filters.department, filters.position]
    });
  };

  const onSubmitFilters = (e) => {
    e?.preventDefault();
    setUseSearch(true);
    refetch();
  };

  const onClear = () => {
    setFilters({ department: '', position: '' });
    setUseSearch(false);
  };

  return (
    <div style={wrap}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <h3 style={{ margin: '0 0 16px' }}>Filters</h3>
        <form onSubmit={onSubmitFilters}>
          <div style={field}>
            <label style={label}>Department</label>
            <input
              placeholder="e.g., IT"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              style={input}
            />
          </div>
          <div style={field}>
            <label style={label}>Position</label>
            <input
              placeholder="e.g., Developer"
              value={filters.position}
              onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              style={input}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" style={btnPrimary}>Search</button>
            <button type="button" onClick={onClear} style={btnGhost}>Clear</button>
          </div>
        </form>

        <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #eee' }} />

        <button onClick={() => nav('/employees/new')} style={btnPrimary}>+ Add Employee</button>
        <button onClick={logout} style={{ ...btnGhost, marginTop: 8 }}>Logout</button>
      </aside>

      {/* Main content */}
      <main style={content}>
        <div style={headerRow}>
          <h2 style={{ margin: 0 }}>Employees</h2>
          {(isLoading || isFetching) && <span style={pill}>Loading…</span>}
        </div>

        <div style={{ border: '1px solid #eaeaea', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#fafafa' }}>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Department</th>
                <th style={th}>Position</th>
                <th style={th}>Salary</th>
                <th style={th}>Image</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading || isFetching) && (
                <tr><td colSpan={7} style={td}>Loading…</td></tr>
              )}
              {!isLoading && data?.length === 0 && (
                <tr><td colSpan={7} style={td}>No employees found.</td></tr>
              )}
              {data?.map(emp => (
                <tr key={emp._id}>
                  <td style={td}>{emp.first_name} {emp.last_name}</td>
                  <td style={td}>{emp.email}</td>
                  <td style={td}>{emp.department}</td>
                  <td style={td}>{emp.position}</td>
                  <td style={td}>{emp.salary}</td>
                  <td style={td}>
                    {emp.profile_image_url
                      ? <img
                          alt="profile"
                          src={emp.profile_image_url}
                          style={{
                            width: 40, height: 40, objectFit: 'cover',
                            borderRadius: '50%', border: '1px solid #eee'
                          }}
                        />
                      : <span style={{ color: '#999' }}>—</span>}
                  </td>
                  <td style={td}>
  <button onClick={() => nav(`/employees/${emp._id}`)} style={{ ...btnGhost, marginRight: 8 }}>
    View
  </button>
  <button onClick={() => nav(`/employees/${emp._id}/edit`)} style={{ ...btnGhost, marginRight: 8 }}>
    Edit
  </button>
  <button onClick={() => onDelete(emp._id)} style={{ ...btnDanger }}>
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/*  inline styles  */
const wrap = {
  display: 'grid',
  gridTemplateColumns: '260px 1fr',
  gap: 16,
  maxWidth: 1200,
  margin: '24px auto',
  fontFamily: 'system-ui'
};
const sidebar = {
  border: '1px solid #eaeaea',
  borderRadius: 10,
  padding: 16,
  height: 'fit-content',
  position: 'sticky',
  top: 24
};
const content = { minWidth: 0 };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 };

const field = { display: 'grid', gap: 6, marginBottom: 12 };
const label = { fontSize: 13, fontWeight: 600, color: '#555' };
const input = { padding: 8, border: '1px solid #ddd', borderRadius: 8 };

const th = { textAlign: 'left', padding: 10, borderBottom: '1px solid #eee', fontWeight: 600, fontSize: 14 };
const td = { padding: 10, borderBottom: '1px solid #f6f6f6', fontSize: 14, verticalAlign: 'middle' };

const btnPrimary = {
  padding: '8px 12px', border: '1px solid #0a7', background: '#0a7',
  color: 'white', borderRadius: 8, cursor: 'pointer'
};
const btnGhost = {
  padding: '8px 12px', border: '1px solid #ddd', background: 'white',
  color: '#333', borderRadius: 8, cursor: 'pointer'
};
const btnDanger = {
  padding: '8px 12px', border: '1px solid #e33', background: '#e33',
  color: 'white', borderRadius: 8, cursor: 'pointer'
};
const pill = {
  fontSize: 12, background: '#eef7ff', color: '#247',
  padding: '4px 8px', borderRadius: 999
};
