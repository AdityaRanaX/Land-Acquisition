module.exports = [
  {
    familyHeadName: 'Ramesh Tukaram Patil',
    phone: '+91 9866001234',
    socialCategory: 'OBC',
    isBPL: false,
    isVulnerable: false,
    isLivelihoodLost: true,
    livelihoodType: 'AGRICULTURE',
    membersCount: 4,
    residentialDisplacement: false,
    members: [
      { name: 'Ramesh Patil', relation: 'Self / Head', age: 48, gender: 'MALE', isDependent: false },
      { name: 'Laxmi Patil', relation: 'Wife', age: 44, gender: 'FEMALE', isDependent: true },
      { name: 'Amit Patil', relation: 'Son', age: 22, gender: 'MALE', isDependent: true },
      { name: 'Pooja Patil', relation: 'Daughter', age: 19, gender: 'FEMALE', isDependent: true }
    ]
  },
  {
    familyHeadName: 'Kailash Baburao Jagtap',
    phone: '+91 9888003344',
    socialCategory: 'SC',
    isBPL: true,
    isVulnerable: true,
    isLivelihoodLost: true,
    livelihoodType: 'TENANT_FARMER',
    membersCount: 5,
    residentialDisplacement: true,
    members: [
      { name: 'Kailash Jagtap', relation: 'Self / Head', age: 52, gender: 'MALE', isDependent: false },
      { name: 'Tara Jagtap', relation: 'Wife', age: 47, gender: 'FEMALE', isDependent: true },
      { name: 'Sachin Jagtap', relation: 'Son', age: 24, gender: 'MALE', isDependent: true },
      { name: 'Rohit Jagtap', relation: 'Son', age: 20, gender: 'MALE', isDependent: true },
      { name: 'Kusum Jagtap', relation: 'Mother', age: 74, gender: 'FEMALE', isDependent: true }
    ]
  }
];
