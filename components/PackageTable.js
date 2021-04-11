export function PackageTable({packages, methods}) {
  return (
    <table className="post-table">
      <thead>
        <tr>
          <th style={{textAlign: 'right'}}>package</th>
          <th>installation method</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(packages).map(([name, ms], i) => (
          <tr key={i}>
            <td style={{textAlign: 'right'}}>{name}</td>
            <td>
              {Object.entries(methods)
                .map(([m, method]) => ms.includes(m) && method)
                .filter(Boolean)
                .join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
