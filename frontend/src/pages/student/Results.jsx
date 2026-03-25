import { PageHeader } from '../../components/ui/index'

const RESULTS = [
  { sem: '5th Semester · BCA · VSKUB', sgpa: '7.8', subjects: [
    {name:'Advanced Java Programming',marks:82,grade:'A'},
    {name:'Web Technologies',marks:78,grade:'A'},
    {name:'Operating Systems',marks:71,grade:'B+'},
    {name:'Computer Graphics',marks:68,grade:'B'},
    {name:'Soft Skills',marks:88,grade:'A+'},
  ]},
  { sem: '4th Semester · BCA · VSKUB', sgpa: '7.5', subjects: [
    {name:'Data Structures',marks:85,grade:'A'},
    {name:'Python Programming',marks:90,grade:'A+'},
    {name:'Mathematics III',marks:62,grade:'C'},
    {name:'Database Management',marks:74,grade:'B+'},
    {name:'Communication Skills',marks:80,grade:'A'},
  ]},
]

const gradeColor = g => g.startsWith('A')?'#22c55e':g.startsWith('B')?'#3b82f6':'#F59E0B'

export default function Results() {
  return (
    <div>
      <PageHeader title="Results" subtitle="Semester-wise results — notified instantly when published" />
      <div className="px-5 py-4">
        <div className="bg-green-950/10 border border-green-900/20 border-l-2 border-l-green-600 px-4 py-2.5 rounded-sm mb-4 text-[0.75rem] text-green-400">
          6th Semester results not yet published. You will receive a push notification the moment they are declared.
        </div>
        {RESULTS.map(r => (
          <div key={r.sem} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 mb-3">
            <div className="font-mono text-[0.62rem] text-[#D97706] uppercase tracking-wide mb-3">{r.sem}</div>
            <table className="w-full">
              <tbody>
                {r.subjects.map(s => (
                  <tr key={s.name} className="border-b border-[#1e1e1e] last:border-0">
                    <td className="py-2 text-[0.78rem] text-[#a3a3a3]">{s.name}</td>
                    <td className="py-2 text-right font-semibold text-[0.78rem]" style={{color:gradeColor(s.grade)}}>
                      {s.marks} / 100 — {s.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-3 pt-3 border-t border-[#262626]">
              <span className="font-mono text-[0.65rem] text-[#525252] uppercase">SGPA</span>
              <span className="font-display font-black text-[1.15rem] text-[#F59E0B]">{r.sgpa}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
