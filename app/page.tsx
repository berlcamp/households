import SearchBar from '@/components/SearchBar'
import { createClient } from '@supabase/supabase-js'

interface HouseholdTypes {
  husband_firstname: string
  husband_middlename: string
  husband_lastname: string
  wife_firstname: string
  wife_middlename: string
  wife_lastname: string
  child_1: string
  barangay: string
}

interface FilterProps {
  keyword?: string;
}

interface HomeProps {
  searchParams: FilterProps;
}

export default async function Home({ searchParams }: HomeProps) {
  const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const supabase = createClient(supabase_url, supabase_key)

  let query = supabase
    .from('asenso_households')
    .select()
    .limit(10)

  // Search match
  if (searchParams.keyword && searchParams.keyword.trim() !== '') {
    const keyword = searchParams.keyword.trim()

    // query = query.or(`husband_lastname.ilike.%${keyword}%,husband_middlename.ilike.%${keyword}%,husband_firstname.ilike.%${keyword}%`)
    // query = query.or(`wife_lastname.ilike.%${searchParams.keyword}%,wife_middlename.ilike.%${searchParams.keyword}%,wife_firstname.ilike.%${searchParams.keyword}%`)

    const searchSplit = keyword.split(' ')
    const keywordArray: any[] = []
    searchSplit.forEach(item => {
      if (item !== '') keywordArray.push(`'${item.trim()}'`)
    })
    const searchQuery = keywordArray.join(' & ')

    query = query.textSearch('householdsearch', searchQuery, {
      type: 'websearch',
      config: 'english'
    })
  }

  const { data, error } = await query

  if (error) console.error(error)

  const households: HouseholdTypes[] | null = data

  return (
    <div className='items-center relative mx-auto mt-24 mb-12 w-5/6'>
      <div className='text-center bg-gray-900 mx-auto z-40 flex justify-center w-full fixed top-0 left-0 right-0'>
          <SearchBar searchKeyword={searchParams.keyword}/>
      </div>
      {
        households?.map((household, index) => (
          <div key={index} className='m-4 my-6 md:inline-flex justify-center bg-yellow-200 text-gray-800 rounded-lg'>
            <div className='flex-col space-y-px p-1 text-sm'>
              <div className='mb-2 text-center text-xs font-semibold'>{household.barangay}</div>
              <div><span className='font-bold text-xs'>H:</span> <span>{household.husband_firstname} {household.husband_middlename} {household.husband_lastname}</span></div>
              <div><span className='font-bold text-xs'>W:</span> <span>{household.wife_firstname} {household.wife_middlename} {household.wife_lastname}</span></div>
              <div><span className='pl-5'>{household.child_1}</span></div>
            </div>
          </div>
        ))
      }
      {
        (!households || households.length === 0) &&
          <div className='text-gray-200 text-center'>No results found</div>
      }
    </div>
  )
}
