import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';

export default function TeamPermissions() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alice Martin', email: 'alice@company.com', role: 'buyer', permissions: ['view_tenders', 'create_tenders', 'evaluate_offers', 'manage_team'] },
    { id: 2, name: 'Bob Dupont', email: 'bob@company.com', role: 'procurement-officer', permissions: ['view_tenders', 'create_tenders'] },
    { id: 3, name: 'Carol Smith', email: 'carol@company.com', role: 'approver', permissions: ['view_tenders', 'approve_offers'] }
  ]);

  const allPermissions = [
    { key: 'view_tenders', label: 'Voir les Appels' },
    { key: 'create_tenders', label: 'Créer les Appels' },
    { key: 'evaluate_offers', label: 'Évaluer les Offres' },
    { key: 'approve_offers', label: 'Approuver les Offres' },
    { key: 'manage_team', label: 'Gérer l\'Équipe' },
    { key: 'manage_invoices', label: 'Gérer les Factures' },
    { key: 'delete_tenders', label: 'Supprimer les Appels' }
  ];

  useEffect(() => {
    setPageTitle('Gestion des Permissions');
  }, []);

  const togglePermission = (memberId, permission) => {
    setTeamMembers(teamMembers.map(member => {
      if (member.id === memberId) {
        const newPermissions = member.permissions.includes(permission)
          ? member.permissions.filter(p => p !== permission)
          : [...member.permissions, permission];
        return {...member, permissions: newPermissions};
      }
      return member;
    }));
  };

  return (
    <div className="page team-permissions-page">
      <div className="page-header corporate">
        <h1>👥 Gestion des Permissions</h1>
        <p className="subtitle">Contrôlez l'accès aux fonctionnalités</p>
      </div>

      <div className="permissions-table-section">
        <table className="table-corporate permissions-table">
          <thead>
            <tr>
              <th>Membre de l'Équipe</th>
              <th>Rôle</th>
              {allPermissions.map(perm => (
                <th key={perm.key} className="permission-header">{perm.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.id}>
                <td>
                  <div className="member-info">
                    <strong>{member.name}</strong>
                    <span className="email">{member.email}</span>
                  </div>
                </td>
                <td><span className="badge">{member.role}</span></td>
                {allPermissions.map(perm => (
                  <td key={perm.key} className="permission-cell">
                    <input
                      type="checkbox"
                      checked={member.permissions.includes(perm.key)}
                      onChange={() => togglePermission(member.id, perm.key)}
                      className="permission-checkbox"
                    />
                  </td>
                ))}
                <td>
                  <button className="btn btn-small btn-secondary-corporate">Enregistrer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
