import { useEffect, useState } from 'react'
import api from '../../../../instance'
import PropTypes from 'prop-types'
import { PageHeader } from '../../../../components/core/cardHeader'
import {IconBtn} from "../../../../components/core/button"
const Index = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reviews?includeInactive=true&limit=200')
      setRows(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async (id, updates) => {
    setSavingId(id)
    try {
      const { data } = await api.put(`/reviews/${id}`, updates)
      setRows(prev => prev.map(r => r._id === id ? data : r))
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'success', title: 'Saved', message: 'Review updated' } }))
      }
    } catch {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'error', title: 'Failed', message: 'Could not update review' } }))
      }
    } finally {
      setSavingId(null)
    }
  }

  const handleToggle = async (id, isActive) => {
    setSavingId(id)
    try {
      const { data } = await api.patch(`/reviews/${id}/active`, { isActive })
      setRows(prev => prev.map(r => r._id === id ? data : r))
    } finally {
      setSavingId(null)
    }
  }

  const Row = ({ r }) => {
    const [form, setForm] = useState({ name: r.name, title: r.title, description: r.description, rating: r.rating, avatarUrl: r.avatarUrl || '' })
    const disabled = savingId === r._id
    return (
      <div className="border p-3 rounded-md flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" disabled={disabled} value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Name" />
          <input className="border p-2 rounded" disabled={disabled} value={form.avatarUrl} onChange={e=>setForm({...form, avatarUrl: e.target.value})} placeholder="Avatar URL" />
          <select className="border p-2 rounded" disabled={disabled} value={form.rating} onChange={e=>setForm({...form, rating: Number(e.target.value)})}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <textarea className="border p-2 rounded md:col-span-2" disabled={disabled} rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Description" />
        </div>
        <div className="flex gap-2 items-center">
          
          <IconBtn
          label='Save'
            icon="save"
            color="primary"
            disabled={disabled}
            onClick={() => handleSave(r._id, form)}
            aria-label="Save review"
            className='bg-white text-black border hover:bg-gray-100'
          >
        
          </IconBtn>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={r.isActive} disabled={disabled} onChange={e=>handleToggle(r._id, e.target.checked)} />
            <span>{r.isActive ? 'Active' : 'Inactive'}</span>
          </label>
        </div>
      </div>
    )
  }

  Row.propTypes = {
    r: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      avatarUrl: PropTypes.string,
      isActive: PropTypes.bool.isRequired,
    }).isRequired
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <PageHeader
        title='Reviews'/>
        {/* <button className="border px-3 py-2 rounded" onClick={fetchData} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button> */}
      </div>
      <div className="grid grid-cols-5 gap-3">
        {rows.map(r => <Row key={r._id} r={r} />)}
        {rows.length === 0 && !loading && <p className="text-gray-500">No reviews yet.</p>}
      </div>
    </div>
  )
}

export default Index
